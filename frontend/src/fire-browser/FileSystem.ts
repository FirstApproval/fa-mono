import { makeObservable, observable } from 'mobx';

interface File {
  fullPath: string;
  name: string;
  isDirectory: boolean;
}

export class FileSystem {
  files: File[] = [];

  constructor() {
    makeObservable(this, {
      files: observable
    });
  }

  addFiles = (files: File[]): void => {
    this.files = [...this.files, ...files];
  };

  listDirectory = (dirPath: string): File[] => {
    return this.files.filter((file) => {
      const filePath = file.fullPath;
      return (
        filePath.startsWith(dirPath) &&
        !filePath.slice(dirPath.length).includes('/')
      );
    });
  };
}
