import { action, makeObservable, observable } from 'mobx';
import { fileService } from '../core/service';

interface File {
  fullPath: string;
  name: string;
  isDirectory: boolean;
}

export class FileSystem {
  currentPath: string = '/';
  files: File[] = [];

  constructor(readonly publicationId: string) {
    makeObservable(this, {
      files: observable,
      currentPath: observable,
      setCurrentPath: action
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
    this.files = [...this.files, ...files];
  };

  listDirectory = async (dirPath: string): Promise<File[]> => {
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
    return [...files, ...this.files].filter((file) => {
      const filePath = file.fullPath;
      return (
        filePath.startsWith(dirPath) &&
        !filePath.slice(dirPath.length).includes('/')
      );
    });
  };
}

const fpToName = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};
