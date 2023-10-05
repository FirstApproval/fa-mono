import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {
  FileApi,
  type PublicationFile,
  UploadType
} from '../apis/first-approval-api';
import { fullPathToName } from './utils';
import { type FileData } from '@first-approval/chonky/dist/types/file.types';
import { calculateSHA256 } from '../util/sha256Util';
import { authStore } from '../core/auth';
import { AxiosProgressEvent } from 'axios';
import { isFileSystemEntry, UploadProgressStore } from './UploadProgressStore';

interface FileEntry {
  id: string;
  fullPath: string;
  name: string;
  isDirectory: boolean;
  isUploading: boolean;
  note?: string;
}

type UploadFilesAfterDialogFunction = (value: UploadType) => void;

export class FileSystemFA {
  rootPathFiles: number = 0;
  currentPath: string = '/';
  private publicationId: string = '';
  private backEndFiles: FileEntry[] = [];
  private localFiles: FileEntry[] = [];
  private allLocalFiles: FileEntry[] = [];
  isLoading = false;
  initialized = false;
  activeUploads = 0;

  uploadProgress = new UploadProgressStore();

  renameOrReplaceDialogOpen = false;
  addDirectoryImpossibleDialogOpen = false;
  moveFilesImpossibleDialogOpen = false;
  renameOrReplaceDialogCallback: UploadFilesAfterDialogFunction = (
    uploadType: UploadType
  ) => {};

  constructor(
    publicationId: string,
    readonly fileService: Omit<FileApi, 'configuration'>
  ) {
    this.publicationId = publicationId;
    makeObservable<
      FileSystemFA,
      'backEndFiles' | 'localFiles' | 'allLocalFiles'
    >(this, {
      rootPathFiles: observable,
      currentPath: observable,
      files: computed,
      backEndFiles: observable,
      localFiles: observable,
      allLocalFiles: observable,
      isLoading: observable,
      initialized: observable,
      renameOrReplaceDialogOpen: observable,
      renameOrReplaceDialogCallback: observable,
      addDirectoryImpossibleDialogOpen: observable,
      moveFilesImpossibleDialogOpen: observable,
      setCurrentPath: action,
      activeUploads: observable
    });

    reaction(
      () => this.currentPath,
      async () => {
        if (this.publicationId) {
          const files = await this.listDirectory(this.currentPath);
          this.backEndFiles = [...files];
        } else {
          this.initialized = true;
        }
      },
      {
        fireImmediately: true
      }
    );

    reaction(() => this.currentPath, this.updateLocalFiles, {
      fireImmediately: true
    });

    reaction(
      () => this.files,
      (files) => {
        if (this.currentPath === '/') {
          this.rootPathFiles = files.length;
        }
      },
      { fireImmediately: true }
    );
  }

  async initialize(publicationId: string): Promise<void> {
    this.publicationId = publicationId;
    const files = await this.listDirectory(this.currentPath);
    this.backEndFiles = [...files];
  }

  getPublicationFilesSize = async (): Promise<number> => {
    const response = await this.fileService.getPublicationFilesSize(
      this.publicationId
    );
    return response.data;
  };

  closeReplaceOrRenameDialog = (): void => {
    this.renameOrReplaceDialogOpen = false;
  };

  closeAddDirectoryImpossibleDialog = (): void => {
    this.addDirectoryImpossibleDialogOpen = false;
  };

  closeMoveFilesImpossibleDialog = (): void => {
    this.moveFilesImpossibleDialogOpen = false;
  };

  get files(): FileEntry[] {
    const unuqiePath: Record<string, boolean> = {}; // Keeps track of seen property values
    return [...this.backEndFiles, ...this.localFiles].filter((entry) => {
      if (unuqiePath[entry.fullPath]) {
        return false; // Duplicate, remove entry
      }
      unuqiePath[entry.fullPath] = true;
      return true;
    });
  }

  setCurrentPath = (path: string): void => {
    this.currentPath = path;
  };

  addFilesInput = (files: File[], uploadType: UploadType): void => {
    const uploadQueue: Array<() => Promise<void>> = [];

    files.forEach((file) => {
      const fullPath = this.fullPath('/' + file.name);
      const uf = this.uploadFile(fullPath, file, uploadType);
      uploadQueue.push(uf);
    });

    void this.uploadQueue(uploadQueue);
    this.allLocalFiles = [
      ...this.allLocalFiles,
      ...files.map((file) => {
        const fullPath = this.fullPath('/' + file.name);
        return {
          id: fullPath,
          name: file.name,
          fullPath,
          isDirectory: false,
          isUploading: true
        };
      })
    ];
    this.updateLocalFiles();
  };

  uploadFile = (
    fullPath: string,
    file: File,
    uploadType: UploadType
  ): (() => Promise<void>) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        this.uploadProgress.updateStatus(fullPath, {
          progress: progressEvent
        });
      },
      signal
    };
    this.uploadProgress.progressStatus.set(fullPath, {
      fullPath,
      file,
      progress: {
        loaded: 0,
        bytes: 0,
        progress: 0
      },
      abortController
    });

    return async (): Promise<void> => {
      const hex = await calculateSHA256(file);

      await this.fileService
        .uploadFile(
          this.publicationId,
          fullPath,
          false,
          uploadType,
          hex,
          file.size,
          file,
          config
        )
        .then((response) => {
          this.cleanUploading(response.data);
          this.actualizeFiles(response.data);
          this.uploadProgress.updateStatus(fullPath, {
            isSuccess: true,
            abortController: undefined
          });
        })
        .catch(() => {
          this.uploadProgress.updateStatus(fullPath, {
            isFailed: true
          });
        });
    };
  };

  addFilesDnd = (files: FileSystemEntry[], uploadType: UploadType): void => {
    const uploadQueue: Array<() => Promise<void>> = [];

    files.forEach((file) => {
      const fullPath = this.fullPath(file.fullPath);
      const uf = this.uploadFileSystemEntry(fullPath, file, uploadType);
      uploadQueue.push(uf);
    });

    void this.uploadQueue(uploadQueue);
    this.allLocalFiles = [
      ...this.allLocalFiles,
      ...files.map((f) => {
        const fullPath = this.fullPath(f.fullPath);
        return {
          id: fullPath,
          name: f.name,
          fullPath,
          isDirectory: f.isDirectory,
          isUploading: true
        };
      })
    ];
    this.updateLocalFiles();
  };

  uploadFileSystemEntry = (
    fullPath: string,
    file: FileSystemEntry,
    uploadType: UploadType
  ): (() => Promise<void>) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        this.uploadProgress.updateStatus(fullPath, {
          progress: progressEvent
        });
      },
      signal
    };
    this.uploadProgress.progressStatus.set(fullPath, {
      fullPath,
      file,
      progress: {
        loaded: 0,
        bytes: 0,
        progress: 0
      },
      abortController
    });

    if (file.isFile) {
      return async (): Promise<void> => {
        (file as FileSystemFileEntry).file(async (file) => {
          const hex = await calculateSHA256(file);
          await this.fileService
            .uploadFile(
              this.publicationId,
              fullPath,
              false,
              uploadType,
              hex,
              file.size,
              file,
              config
            )
            .then((response) => {
              this.cleanUploading(response.data);
              this.actualizeFiles(response.data);
              this.uploadProgress.updateStatus(fullPath, {
                isSuccess: true,
                abortController: undefined
              });
            })
            .catch(() => {
              this.uploadProgress.updateStatus(fullPath, {
                isFailed: true
              });
            });
        });
      };
    } else {
      return async (): Promise<void> => {
        await this.fileService
          .uploadFile(
            this.publicationId,
            fullPath,
            true,
            uploadType,
            undefined,
            undefined,
            undefined,
            config
          )
          .then((response) => {
            this.cleanUploading(response.data);
            this.uploadProgress.updateStatus(fullPath, {
              isSuccess: true,
              abortController: undefined
            });
          })
          .catch(() => {
            this.uploadProgress.updateStatus(fullPath, {
              isFailed: true
            });
          });
      };
    }
  };

  retryUploadAll = (): void => {
    const uploadQueue: Array<() => Promise<void>> = [];
    const allFailed = this.uploadProgress.allFailed;
    allFailed.forEach((f) => {
      if (isFileSystemEntry(f.file)) {
        const uf = this.uploadFileSystemEntry(
          f.fullPath,
          f.file,
          UploadType.REPLACE
        );
        uploadQueue.push(uf);
      } else {
        const uf = this.uploadFile(f.fullPath, f.file, UploadType.REPLACE);
        uploadQueue.push(uf);
      }
    });

    void this.uploadQueue(uploadQueue);
    this.allLocalFiles = [
      ...this.allLocalFiles,
      ...allFailed.map((f) => {
        const fullPath = f.fullPath;
        return {
          id: fullPath,
          name: f.file.name,
          fullPath,
          isDirectory: isFileSystemEntry(f.file) ? f.file.isDirectory : false,
          isUploading: true
        };
      })
    ];
    this.updateLocalFiles();
  };

  actualizeFiles = (pf: PublicationFile): void => {
    this.actualizeAllLocalFiles(pf);
    if (pf.dirPath === this.currentPath) {
      this.actualizeLocalFiles(pf);
    }
  };

  actualizeAllLocalFiles = (pf: PublicationFile): void => {
    const unuqiePath: Record<string, boolean> = {}; // Keeps track of seen property values
    this.allLocalFiles = [
      {
        id: pf.id ?? '',
        fullPath: pf.fullPath ?? '',
        name: fullPathToName(pf.fullPath ?? ''),
        isDirectory: pf.isDir ?? false,
        isUploading: false,
        note: pf.description
      },
      ...this.allLocalFiles
    ].filter((entry) => {
      if (unuqiePath[entry.fullPath]) {
        return false; // Duplicate, remove entry
      }
      unuqiePath[entry.fullPath] = true;
      return true;
    });
  };

  actualizeLocalFiles = (pf: PublicationFile): void => {
    const unuqiePath: Record<string, boolean> = {}; // Keeps track of seen property values
    this.localFiles = [
      {
        id: pf.id ?? '',
        fullPath: pf.fullPath ?? '',
        name: fullPathToName(pf.fullPath ?? ''),
        isDirectory: pf.isDir ?? false,
        isUploading: false,
        note: pf.description
      },
      ...this.localFiles
    ].filter((entry) => {
      if (unuqiePath[entry.fullPath]) {
        return false; // Duplicate, remove entry
      }
      unuqiePath[entry.fullPath] = true;
      return true;
    });
  };

  createFolder = (name: string): void => {
    const fullPath = `${this.currentPath}${name}`;

    void this.fileService
      .createFolder(this.publicationId, {
        name,
        dirPath: this.currentPath
      })
      .then((response) => {
        this.cleanUploading(response.data);
      });

    this.allLocalFiles = [
      ...this.allLocalFiles,
      {
        id: fullPath,
        name,
        fullPath,
        isDirectory: true,
        isUploading: true
      }
    ];
    this.updateLocalFiles();
  };

  updateFile = (id: string, name: string, note: string): void => {
    void this.fileService.editFile(id, {
      name,
      description: note
    });
    const filter = (f: FileEntry): FileEntry => {
      if (f.id === id) {
        return {
          ...f,
          name,
          note
        };
      } else {
        return f;
      }
    };
    this.backEndFiles = this.backEndFiles.map(filter);
    this.allLocalFiles = this.allLocalFiles.map(filter);
    this.updateLocalFiles();
  };

  deleteFile = (ids: string[]): void => {
    void this.fileService.deleteFiles({ ids });
    const filter = (f: FileEntry): boolean => !ids.includes(f.id);
    this.backEndFiles = this.backEndFiles.filter(filter);
    this.allLocalFiles = this.allLocalFiles.filter(filter);
    this.updateLocalFiles();
  };

  moveFiles = async (files: FileData[], destination: string): Promise<void> => {
    const newFileFullPaths = files.map((f) => destination + f.name);
    const checkResult = await this.hasDuplicates(newFileFullPaths);
    if (checkResult !== DuplicateCheckResult.DUPLICATES_NOT_FOUND) {
      this.moveFilesImpossibleDialogOpen = true;
      return;
    }
    const ids = files.map((f) => f.id);
    for (const id of ids) {
      void this.fileService.moveFile(id, { newDirPath: destination });
    }
    const filter = (f: FileEntry): boolean => !ids.includes(f.id);
    this.backEndFiles = this.backEndFiles.filter(filter);
    this.allLocalFiles = this.allLocalFiles.filter(filter);
    this.updateLocalFiles();
  };

  hasDuplicatesInCurrentFolder = async (
    fullPaths: string[],
    isFirstElemRootFolder: boolean
  ): Promise<DuplicateCheckResult> => {
    const res = await this.fileService.checkFileDuplicates(this.publicationId, {
      fullPathList: fullPaths.map((i) => this.fullPath('/' + i))
    });
    const firstPropertyValue = res.data[this.fullPath('/' + fullPaths[0])];
    if (isFirstElemRootFolder && firstPropertyValue) {
      return DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS;
    }
    for (const i in res.data) {
      if (res.data[this.fullPath('/' + i)]) {
        return DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS;
      }
    }
    return DuplicateCheckResult.DUPLICATES_NOT_FOUND;
  };

  hasDuplicates = async (
    fullPaths: string[]
  ): Promise<DuplicateCheckResult> => {
    const res = await this.fileService.checkFileDuplicates(this.publicationId, {
      fullPathList: fullPaths
    });
    for (const i in res.data) {
      if (res.data[i]) {
        return DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS;
      }
    }
    return DuplicateCheckResult.DUPLICATES_NOT_FOUND;
  };

  private readonly updateLocalFiles = (): void => {
    this.localFiles = this.allLocalFiles.filter((file) => {
      const filePath = file.fullPath;
      return (
        filePath.startsWith(this.currentPath) &&
        !filePath.slice(this.currentPath.length).includes('/')
      );
    });
  };

  private readonly cleanUploading = (file: PublicationFile): void => {
    if (!file.fullPath || !file.id) return;
    const id = file.id;
    if (this.inCurrentDirectory(file)) {
      this.allLocalFiles = this.allLocalFiles.map((f) => {
        if (f.fullPath === file.fullPath) {
          return {
            ...f,
            id,
            isUploading: false
          };
        } else {
          return f;
        }
      });
      this.updateLocalFiles();
    } else {
      this.allLocalFiles = this.allLocalFiles.filter(
        (f) => f.fullPath !== file.fullPath
      );
    }
  };

  private inCurrentDirectory(file: PublicationFile): boolean {
    if (!file.fullPath) return false;
    return (
      file.fullPath.substring(0, file.fullPath.lastIndexOf('/') + 1) ===
      this.currentPath
    );
  }

  private async uploadQueue(
    uploadQueue: Array<() => Promise<void>>
  ): Promise<void> {
    const concurrencyLimit = 4;
    const queueLength = uploadQueue.length;
    const results: Array<Promise<void>> = [];
    let currentIndex = 0;
    this.activeUploads += uploadQueue.length;

    // Helper function to execute a single promise from the queue
    const executePromise = async (index: number): Promise<void> => {
      // Execute the promise at the given index
      await uploadQueue[index]();
      this.activeUploads -= 1;
    };

    // Function to handle the next promise in the queue
    const handleNextPromise = async (): Promise<void> => {
      if (currentIndex < queueLength) {
        const promiseIndex = currentIndex;
        currentIndex++;
        const promise = executePromise(promiseIndex);
        results.push(promise);
        promise.finally(handleNextPromise);
      }
    };

    // Start the initial batch of promises
    for (let i = 0; i < concurrencyLimit && i < queueLength; i++) {
      void handleNextPromise();
    }

    // Wait for all promises to complete
    await Promise.all(results);
  }

  private fullPath(fullPath: string): string {
    const currentPath = this.currentPath;
    return currentPath.substring(0, currentPath.length - 1) + fullPath;
  }

  private readonly listDirectory = async (
    dirPath: string
  ): Promise<FileEntry[]> => {
    this.isLoading = true;
    try {
      let method;
      if (authStore.token) {
        method = this.fileService.getPublicationFiles(
          this.publicationId,
          dirPath
        );
      } else {
        method = this.fileService.getPublicationFilesPublic(
          this.publicationId,
          dirPath
        );
      }
      const response = await method;
      return response.data.map((pf) => {
        return {
          id: pf.id ?? '',
          fullPath: pf.fullPath ?? '',
          name: fullPathToName(pf.fullPath ?? ''),
          isDirectory: pf.isDir ?? false,
          isUploading: false,
          note: pf.description
        };
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.initialized = true;
      });
    }
  };
}

export enum DuplicateCheckResult {
  ROOT_NAME_ALREADY_EXISTS,
  ONE_OR_MORE_FILE_ALREADY_EXISTS,
  DUPLICATES_NOT_FOUND
}
