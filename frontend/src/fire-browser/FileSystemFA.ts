import {
  action,
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

export interface FileEntry {
  id?: string;
  fullPath: string;
  name: string;
  isDirectory: boolean;
  note?: string;
}

type UploadFilesAfterDialogFunction = (value: UploadType) => void;

export class FileSystemFA {
  rootPathFiles: number = 0;
  currentPath: string = '/';
  files = new Map<string, FileEntry>();
  publicationId: string = '';
  isLoading = false;
  initialized = false;
  activeUploads = 0;

  uploadProgress = new UploadProgressStore(this);

  renameOrReplaceDialogOpen = false;
  addDirectoryImpossibleDialogOpen = false;
  moveFilesImpossibleDialogOpen = false;
  renameOrReplaceDialogCallback: UploadFilesAfterDialogFunction = (
    uploadType: UploadType
  ) => {};

  constructor(readonly fileService: Omit<FileApi, 'configuration'>) {
    makeObservable(this, {
      publicationId: observable,
      rootPathFiles: observable,
      currentPath: observable,
      files: observable,
      isLoading: observable,
      initialized: observable,
      renameOrReplaceDialogOpen: observable,
      renameOrReplaceDialogCallback: observable,
      addDirectoryImpossibleDialogOpen: observable,
      moveFilesImpossibleDialogOpen: observable,
      setCurrentPath: action,
      setPublicationId: action,
      activeUploads: observable
    });

    reaction(
      () => ({
        publicationId: this.publicationId,
        currentPath: this.currentPath
      }),
      async () => {
        if (this.publicationId) {
          await this.updateCurrentDirectory();
        } else {
          this.initialized = true;
        }
      },
      {
        fireImmediately: true
      }
    );
  }

  setPublicationId(publicationId: string): void {
    this.publicationId = publicationId;
  }

  async updateCurrentDirectory(): Promise<void> {
    const path = this.currentPath;
    const files = await this.getPublicationFiles(path);
    this.addFiles(files);
  }

  addFiles(files: FileEntry[]): void {
    for (const file of files) {
      this.files.set(file.fullPath, file);
    }
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
    const entries = files.map((file) => {
      const fullPath = this.fullPath('/' + file.name);
      return {
        name: file.name,
        fullPath,
        isDirectory: false,
        isUploading: true
      };
    });
    this.addFiles(entries);
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
          this.updateUpload(fullPath, response.data);
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
    const entries = files.map((f) => {
      const fullPath = this.fullPath(f.fullPath);
      return {
        name: f.name,
        fullPath,
        isDirectory: f.isDirectory,
        isUploading: true
      };
    });
    this.addFiles(entries);
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
              this.updateUpload(fullPath, response.data);
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
            this.updateUpload(fullPath, response.data);
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

  updateUpload(fullPath: string, file: PublicationFile): void {
    this.files.set(fullPath, {
      id: file.id,
      name: fullPathToName(file.fullPath ?? ''),
      fullPath,
      isDirectory: file.isDir ?? false
    });
  }

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
  };

  createFolder = (name: string): void => {
    const fullPath = `${this.currentPath}${name}`;

    void this.fileService
      .createFolder(this.publicationId, {
        name,
        dirPath: this.currentPath
      })
      .then((response) => {
        this.files.set(fullPath, {
          id: response.data.id,
          name,
          fullPath,
          isDirectory: true
        });
      });
  };

  updateFile = (id: string, name: string, note: string): void => {
    void this.fileService.editFile(id, {
      name,
      description: note
    });
  };

  deleteFile = (fullPaths: string[]): void => {
    const ids = fullPaths
      .map((f) => this.files.get(f)?.id)
      .filter((t) => t !== undefined) as string[];
    if (ids.length) {
      void this.fileService.deleteFiles({ ids });
    }
    fullPaths.forEach((f) => this.files.delete(f));
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

  private readonly getPublicationFiles = async (
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
