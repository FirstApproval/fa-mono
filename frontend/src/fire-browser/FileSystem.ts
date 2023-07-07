import { action, autorun, makeObservable, observable } from 'mobx';
import { fileService } from '../core/service';

interface PublicationFile {
  id: string;
  fullPath: string;
  name: string;
  isDirectory: boolean;
  isUploading: boolean;
}

export class FileSystem {
  currentPath: string = '/';
  files: PublicationFile[] = [];
  backEndFiles: PublicationFile[] = [];
  localFiles: PublicationFile[] = [];
  isLoading = false;

  constructor(readonly publicationId: string) {
    makeObservable(this, {
      currentPath: observable,
      files: observable,
      backEndFiles: observable,
      localFiles: observable,
      isLoading: observable,
      setCurrentPath: action
    });

    autorun(async () => {
      const files = await this.listDirectory(this.currentPath);
      this.backEndFiles = [...files];
    });

    autorun(() => {
      this.files = filterUniqueBy(
        [...this.backEndFiles, ...this.localFiles],
        'fullPath'
      ).filter((file) => {
        const filePath = file.fullPath;
        return (
          filePath.startsWith(this.currentPath) &&
          !filePath.slice(this.currentPath.length).includes('/')
        );
      });
    });
  }

  setCurrentPath = (path: string): void => {
    this.currentPath = path;
  };

  addFiles = (files: FileSystemEntry[]): void => {
    void this.uploadQueue(files);
    this.localFiles = [
      ...this.localFiles,
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
  };

  createFolder = (name: string): void => {
    const fullPath = `${this.currentPath}${name}`;

    void fileService
      .createFolder(this.publicationId, {
        name,
        dirPath: this.currentPath
      })
      .then(() => {
        this.cleanUploading(fullPath);
      });

    this.localFiles = [
      ...this.localFiles,
      {
        id: fullPath,
        name,
        fullPath,
        isDirectory: true,
        isUploading: true
      }
    ];
  };

  deleteFile = (ids: string[]): void => {
    void fileService.deleteFiles({ ids });
    const filter = (f: PublicationFile): boolean => !ids.includes(f.id);
    this.backEndFiles = this.backEndFiles.filter(filter);
    this.localFiles = this.localFiles.filter(filter);
  };

  moveFiles = (ids: string[], destination: string): void => {
    for (const id of ids) {
      void fileService.moveFile(id, { newDirPath: destination });
    }
  };

  private readonly cleanUploading = (fullPath: string): void => {
    if (
      fullPath.substring(0, fullPath.lastIndexOf('/') + 1) === this.currentPath
    ) {
      this.localFiles = this.localFiles.map((f) => {
        if (f.fullPath === fullPath) {
          return { ...f, isUploading: false };
        } else {
          return f;
        }
      });
    }
  };

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
                .then(() => {
                  this.cleanUploading(fullPath);
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
            .then(() => {
              this.cleanUploading(fullPath);
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
  ): Promise<PublicationFile[]> => {
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
          isUploading: false
        };
      });
    } finally {
      this.isLoading = false;
    }
  };
}

function filterUniqueBy(array: any[], property: any): any[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[property];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

const fpToName = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};
