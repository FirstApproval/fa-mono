import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {
  type UploadType,
  type PublicationFile
} from 'src/apis/first-approval-api';
import { sampleFileService } from '../../core/service';
import { fullPathToName } from '../utils';

interface FileEntry {
  id: string;
  fullPath: string;
  name: string;
  isDirectory: boolean;
  isUploading: boolean;
  note?: string;
}

type UploadFilesAfterDialogFunction = (value: UploadType) => void;

export class ChonkySampleFileSystem {
  currentPath: string = '/';
  isLoading = false;
  initialized = false;
  renameOrReplaceDialogOpen = false;
  addDirectoryImpossibleDialogOpen = false;
  private backEndSampleFiles: FileEntry[] = [];
  private localSampleFiles: FileEntry[] = [];
  private allLocalSampleFiles: FileEntry[] = [];

  constructor(readonly publicationId: string) {
    makeObservable<
      ChonkySampleFileSystem,
      'backEndSampleFiles' | 'localSampleFiles' | 'allLocalSampleFiles'
    >(this, {
      currentPath: observable,
      files: computed,
      backEndSampleFiles: observable,
      localSampleFiles: observable,
      allLocalSampleFiles: observable,
      isLoading: observable,
      initialized: observable,
      renameOrReplaceDialogOpen: observable,
      renameOrReplaceDialogCallback: observable,
      addDirectoryImpossibleDialogOpen: observable,
      setCurrentPath: action
    });

    reaction(
      () => this.currentPath,
      async () => {
        const files = await this.listDirectory(this.currentPath);
        this.backEndSampleFiles = [...files];
      },
      {
        fireImmediately: true
      }
    );

    reaction(() => this.currentPath, this.updateLocalFiles, {
      fireImmediately: true
    });
  }

  get files(): FileEntry[] {
    const unuqiePath: Record<string, boolean> = {}; // Keeps track of seen property values
    return [...this.backEndSampleFiles, ...this.localSampleFiles].filter(
      (entry) => {
        if (unuqiePath[entry.fullPath]) {
          return false; // Duplicate, remove entry
        }
        unuqiePath[entry.fullPath] = true;
        return true;
      }
    );
  }

  renameOrReplaceDialogCallback: UploadFilesAfterDialogFunction = (
    uploadType: UploadType
  ) => {};

  closeReplaceOrRenameDialog = (): void => {
    this.renameOrReplaceDialogOpen = false;
  };

  closeAddDirectoryImpossibleDialog = (): void => {
    this.addDirectoryImpossibleDialogOpen = false;
  };

  setCurrentPath = (path: string): void => {
    this.currentPath = path;
  };

  addFilesInput = (files: File[], uploadType: UploadType): void => {
    const uploadQueue: Array<() => Promise<void>> = [];

    files.forEach((e) => {
      const fullPath = this.fullPath('/' + e.name);

      const uploadFile = async (): Promise<void> => {
        await sampleFileService
          .uploadSampleFile(
            this.publicationId,
            fullPath,
            false,
            uploadType,
            e.size,
            e
          )
          .then((response) => {
            this.cleanUploading(response.data);
            this.actualizeFiles(response.data);
          });
      };

      uploadQueue.push(uploadFile);
    });

    void this.uploadQueue(uploadQueue);
    this.allLocalSampleFiles = [
      ...this.allLocalSampleFiles,
      ...files.map((f) => {
        const fullPath = this.fullPath('/' + f.name);
        return {
          id: fullPath,
          name: f.name,
          fullPath,
          isDirectory: false,
          isUploading: true
        };
      })
    ];
    this.updateLocalFiles();
  };

  addFilesDnd = (files: FileSystemEntry[], uploadType: UploadType): void => {
    const uploadQueue: Array<() => Promise<void>> = [];

    files.forEach((e) => {
      const fullPath = this.fullPath(e.fullPath);

      if (e.isFile) {
        const uploadFile = async (): Promise<void> => {
          await new Promise<void>((resolve) => {
            (e as FileSystemFileEntry).file((file) => {
              void sampleFileService
                .uploadSampleFile(
                  this.publicationId,
                  fullPath,
                  false,
                  uploadType,
                  file.size,
                  file
                )
                .then((response) => {
                  this.cleanUploading(response.data);
                  this.actualizeFiles(response.data);
                })
                .finally(() => {
                  resolve();
                });
            });
          });
        };

        uploadQueue.push(uploadFile);
      } else {
        const uploadFolder = async (): Promise<void> => {
          await sampleFileService
            .uploadSampleFile(this.publicationId, fullPath, true, uploadType)
            .then((response) => {
              this.cleanUploading(response.data);
            });
        };

        uploadQueue.push(uploadFolder);
      }
    });

    void this.uploadQueue(uploadQueue);
    this.allLocalSampleFiles = [
      ...this.allLocalSampleFiles,
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

  actualizeFiles = (pf: PublicationFile): void => {
    this.actualizeAllLocalFiles(pf);
    if (pf.dirPath === this.currentPath) {
      this.actualizeLocalFiles(pf);
    }
  };

  actualizeAllLocalFiles = (pf: PublicationFile): void => {
    const unuqiePath: Record<string, boolean> = {}; // Keeps track of seen property values
    this.allLocalSampleFiles = [
      {
        id: pf.id ?? '',
        fullPath: pf.fullPath ?? '',
        name: fullPathToName(pf.fullPath ?? ''),
        isDirectory: pf.isDir ?? false,
        isUploading: false,
        note: pf.description
      },
      ...this.allLocalSampleFiles
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
    this.localSampleFiles = [
      {
        id: pf.id ?? '',
        fullPath: pf.fullPath ?? '',
        name: fullPathToName(pf.fullPath ?? ''),
        isDirectory: pf.isDir ?? false,
        isUploading: false,
        note: pf.description
      },
      ...this.localSampleFiles
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

    void sampleFileService
      .createFolderForSampleFile(this.publicationId, {
        name,
        dirPath: this.currentPath
      })
      .then((response) => {
        this.cleanUploading(response.data);
      });

    this.allLocalSampleFiles = [
      ...this.allLocalSampleFiles,
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
    void sampleFileService.editSampleFile(id, { name, description: note });
    const filter = (f: FileEntry): FileEntry => {
      if (f.id === id) {
        return { ...f, name, note };
      } else {
        return f;
      }
    };
    this.backEndSampleFiles = this.backEndSampleFiles.map(filter);
    this.allLocalSampleFiles = this.allLocalSampleFiles.map(filter);
    this.updateLocalFiles();
  };

  deleteFile = (ids: string[]): void => {
    void sampleFileService.deleteSampleFiles({ ids });
    const filter = (f: FileEntry): boolean => !ids.includes(f.id);
    this.backEndSampleFiles = this.backEndSampleFiles.filter(filter);
    this.allLocalSampleFiles = this.allLocalSampleFiles.filter(filter);
    this.updateLocalFiles();
  };

  hasDuplicatesInCurrentFolder = async (
    fullPaths: string[],
    isFirstElemRootFolder: boolean
  ): Promise<DuplicateCheckResult> => {
    const res = await sampleFileService.checkSampleFileDuplicates(
      this.publicationId,
      {
        fullPathList: fullPaths.map((i) => this.fullPath('/' + i))
      }
    );
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
    const res = await sampleFileService.checkSampleFileDuplicates(
      this.publicationId,
      {
        fullPathList: fullPaths
      }
    );
    for (const i in res.data) {
      if (res.data[i]) {
        return DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS;
      }
    }
    return DuplicateCheckResult.DUPLICATES_NOT_FOUND;
  };

  private readonly updateLocalFiles = (): void => {
    this.localSampleFiles = this.allLocalSampleFiles.filter((file) => {
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
      this.allLocalSampleFiles = this.allLocalSampleFiles.map((f) => {
        if (f.fullPath === file.fullPath) {
          return { ...f, id, isUploading: false };
        } else {
          return f;
        }
      });
      this.updateLocalFiles();
    } else {
      this.allLocalSampleFiles = this.allLocalSampleFiles.filter(
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

    // Helper function to execute a single promise from the queue
    const executePromise = async (index: number): Promise<void> => {
      // Execute the promise at the given index
      await uploadQueue[index]();
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
      const response = await sampleFileService.getPublicationSampleFiles(
        this.publicationId,
        dirPath
      );
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
