import { action, autorun, makeObservable, observable } from 'mobx';
import { fileService } from '../core/service';

interface PublicationFile {
  fullPath: string;
  name: string;
  isDirectory: boolean;
  isUploading: boolean;
}

export class FileSystem {
  currentPath: string = '/';
  files: PublicationFile[] = [];
  localFiles: PublicationFile[] = [];
  isLoading = false;

  constructor(readonly publicationId: string) {
    makeObservable(this, {
      files: observable,
      localFiles: observable,
      isLoading: observable,
      currentPath: observable,
      setCurrentPath: action
    });

    autorun(async () => {
      const files = await this.listDirectory(this.currentPath, this.localFiles);
      this.files = [...files];
    });
  }

  setCurrentPath = (path: string): void => {
    this.currentPath = path;
  };

  addFiles = (files: FileSystemEntry[]): void => {
    const currentPath = this.currentPath;
    void this.uploadQueue(files);
    this.localFiles = [
      ...this.localFiles,
      ...files.map((f) => {
        const fullPath =
          currentPath.substring(0, currentPath.length - 1) + f.fullPath;
        return {
          name: f.name,
          fullPath,
          isDirectory: f.isDirectory,
          isUploading: true
        };
      })
    ];
  };

  private async uploadQueue(result: FileSystemEntry[]): Promise<void> {
    const currentPath = this.currentPath;
    const queue: Array<() => Promise<any>> = [];
    const maxParallelRequests = 4;

    result.forEach((e) => {
      queue.push(async () => {
        const fullPath =
          currentPath.substring(0, currentPath.length - 1) + e.fullPath;
        if (e.isFile) {
          return await new Promise<File>((resolve) => {
            (e as FileSystemFileEntry).file((file) => {
              resolve(file);
            });
          }).then(async (file) => {
            return await fileService.uploadFile(
              this.publicationId,
              fullPath,
              false,
              file
            );
          });
        } else {
          return await fileService.uploadFile(
            this.publicationId,
            fullPath,
            true
          );
        }
      });
    });

    // Функция для выполнения промисов с ограничением
    const executePromisesWithLimit = async (
      queue: Array<() => Promise<any>>,
      limit: number
    ): Promise<void> => {
      let executing = 0;

      const processQueue = async (): Promise<void> => {
        while (executing < limit && queue.length > 0) {
          const promiseFn = queue.shift();
          if (promiseFn) {
            const promise = promiseFn();
            executing++;
            void promise.then(() => {
              executing--;
              void processQueue();
            });
          }
        }
      };

      await processQueue();
    };

    // Выполнение промисов с ограничением в 4
    await executePromisesWithLimit(queue, maxParallelRequests);
  }

  private readonly listDirectory = async (
    dirPath: string,
    localFiles: PublicationFile[]
  ): Promise<PublicationFile[]> => {
    this.isLoading = true;
    try {
      const response = await fileService.getPublicationFiles(
        this.publicationId,
        dirPath
      );
      const files: PublicationFile[] = response.data.map((pf) => {
        return {
          ...pf,
          fullPath: pf.fullPath ?? '',
          name: fpToName(pf.fullPath ?? ''),
          isDirectory: pf.isDir ?? false,
          isUploading: false
        };
      });
      return [...localFiles, ...files].filter((file) => {
        const filePath = file.fullPath;
        return (
          filePath.startsWith(dirPath) &&
          !filePath.slice(dirPath.length).includes('/')
        );
      });
    } finally {
      this.isLoading = false;
    }
  };
}

const fpToName = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};
