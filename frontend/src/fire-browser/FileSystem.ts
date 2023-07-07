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
      currentPath: observable,
      files: observable,
      localFiles: observable,
      isLoading: observable,
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
    void this.uploadQueue(files);
    this.localFiles = [
      ...this.localFiles,
      ...files.map((f) => {
        const fullPath = this.fullPath(f.fullPath);
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
    result.forEach((e) => {
      const fullPath = this.fullPath(e.fullPath);
      if (e.isFile) {
        void new Promise<File>((resolve) => {
          (e as FileSystemFileEntry).file((file) => {
            resolve(file);
          });
        }).then(async (file) => {
          void fileService.uploadFile(
            this.publicationId,
            fullPath,
            false,
            file
          );
        });
      } else {
        void fileService.uploadFile(this.publicationId, fullPath, true);
      }
    });
  }

  private fullPath(fullPath: string): string {
    const currentPath = this.currentPath;
    return currentPath.substring(0, currentPath.length - 1) + fullPath;
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
