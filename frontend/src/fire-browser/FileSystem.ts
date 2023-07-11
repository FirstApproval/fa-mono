import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  reaction
} from 'mobx';
import { fileService } from '../core/service';
import { type PublicationFile } from '../apis/first-approval-api';

interface FileEntry {
  id: string;
  fullPath: string;
  name: string;
  isDirectory: boolean;
  isUploading: boolean;
  note?: string;
}

export class FileSystem {
  currentPath: string = '/';
  private backEndFiles: FileEntry[] = [];
  private localFiles: FileEntry[] = [];
  private allLocalFiles: FileEntry[] = [];
  isLoading = false;

  constructor(readonly publicationId: string) {
    makeObservable<FileSystem, 'backEndFiles' | 'localFiles' | 'allLocalFiles'>(
      this,
      {
        currentPath: observable,
        files: computed,
        backEndFiles: observable,
        localFiles: observable,
        allLocalFiles: observable,
        isLoading: observable,
        setCurrentPath: action
      }
    );

    autorun(async () => {
      const files = await this.listDirectory(this.currentPath);
      this.backEndFiles = [...files];
    });

    reaction(() => this.currentPath, this.updateLocalFiles, {
      fireImmediately: true
    });
  }

  get files(): FileEntry[] {
    return [...this.backEndFiles, ...this.localFiles];
  }

  setCurrentPath = (path: string): void => {
    this.currentPath = path;
  };

  addFiles = (files: FileSystemEntry[]): void => {
    void this.uploadQueue(files);
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

  createFolder = (name: string): void => {
    const fullPath = `${this.currentPath}${name}`;

    void fileService
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
    void fileService.editFile(id, { name, description: note });
    const filter = (f: FileEntry): FileEntry => {
      if (f.id === id) {
        return { ...f, name, note };
      } else {
        return f;
      }
    };
    this.backEndFiles = this.backEndFiles.map(filter);
    this.allLocalFiles = this.allLocalFiles.map(filter);
    this.updateLocalFiles();
  };

  deleteFile = (ids: string[]): void => {
    void fileService.deleteFiles({ ids });
    const filter = (f: FileEntry): boolean => !ids.includes(f.id);
    this.backEndFiles = this.backEndFiles.filter(filter);
    this.allLocalFiles = this.allLocalFiles.filter(filter);
    this.updateLocalFiles();
  };

  moveFiles = (ids: string[], destination: string): void => {
    for (const id of ids) {
      void fileService.moveFile(id, { newDirPath: destination });
    }
    const filter = (f: FileEntry): boolean => !ids.includes(f.id);
    this.backEndFiles = this.backEndFiles.filter(filter);
    this.allLocalFiles = this.allLocalFiles.filter(filter);
    this.updateLocalFiles();
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
          return { ...f, id, isUploading: false };
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

  private async uploadQueue(result: FileSystemEntry[]): Promise<void> {
    const concurrencyLimit = 4;
    let runningCount = 0;
    const uploadQueue: Array<() => Promise<void>> = [];

    const executeNextUpload = async (): Promise<void> => {
      while (uploadQueue.length > 0 && runningCount < concurrencyLimit) {
        const nextUpload = uploadQueue.shift();
        runningCount++;
        try {
          if (nextUpload) {
            await nextUpload();
          }
        } finally {
          runningCount--;
          void executeNextUpload();
        }
      }
    };

    result.forEach((e) => {
      const fullPath = this.fullPath(e.fullPath);

      if (e.isFile) {
        const uploadFile = async (): Promise<void> => {
          await new Promise<void>((resolve) => {
            (e as FileSystemFileEntry).file((file) => {
              void fileService
                .uploadFile(this.publicationId, fullPath, false, file)
                .then((response) => {
                  this.cleanUploading(response.data);
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
          await fileService
            .uploadFile(this.publicationId, fullPath, true)
            .then((response) => {
              this.cleanUploading(response.data);
            });
        };

        uploadQueue.push(uploadFolder);
      }
    });

    await executeNextUpload();
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
      const response = await fileService.getPublicationFiles(
        this.publicationId,
        dirPath
      );
      return response.data.map((pf) => {
        return {
          id: pf.id ?? '',
          fullPath: pf.fullPath ?? '',
          name: fpToName(pf.fullPath ?? ''),
          isDirectory: pf.isDir ?? false,
          isUploading: false,
          note: pf.description
        };
      });
    } finally {
      this.isLoading = false;
    }
  };
}

const fpToName = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};
