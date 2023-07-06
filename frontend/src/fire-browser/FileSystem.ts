import { action, autorun, makeObservable, observable } from 'mobx';
import { fileService } from '../core/service';

interface File {
  fullPath: string;
  name: string;
  isDirectory: boolean;
}

export class FileSystem {
  currentPath: string = '/';
  files: File[] = [];
  localFiles: File[] = [];
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
    files.forEach((e) => {
      if (e.isFile) {
        (e as FileSystemFileEntry).file((file) => {
          void fileService.uploadFile(
            this.publicationId,
            e.fullPath,
            false,
            file
          );
        });
      } else {
        void fileService.uploadFile(this.publicationId, e.fullPath, true);
      }
    });
    this.localFiles = [...this.localFiles, ...files];
  };

  private readonly listDirectory = async (
    dirPath: string,
    localFiles: File[]
  ): Promise<File[]> => {
    this.isLoading = true;
    try {
      const response = await fileService.getPublicationFiles(
        this.publicationId,
        dirPath
      );
      const files: File[] = response.data.map((pf) => {
        return {
          ...pf,
          fullPath: pf.fullPath ?? '',
          name: fpToName(pf.fullPath ?? ''),
          isDirectory: pf.isDir ?? false
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
