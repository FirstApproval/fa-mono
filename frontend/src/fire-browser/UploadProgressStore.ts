import { makeAutoObservable } from 'mobx';
import { AxiosProgressEvent } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemFA } from './FileSystemFA';

interface ProgressStatus {
  fullPath: string;
  file: File | FileSystemEntry;
  progress: AxiosProgressEvent;
  abortController?: AbortController;
  isFailed?: boolean;
  isSuccess?: boolean;
}

export class UploadProgressStore {
  progressStatus = new Map<string, ProgressStatus>();

  constructor(readonly fs: FileSystemFA) {
    makeAutoObservable(this);
  }

  get count(): number {
    return this.progressStatus.size;
  }

  get inProgress(): number {
    return [...this.progressStatus.values()].filter(
      (m) => !m.isSuccess && !m.isFailed
    ).length;
  }

  get success(): number {
    return this.allSuccess.length;
  }

  get failed(): number {
    return this.allFailed.length;
  }

  clear = (): void => {
    this.progressStatus = new Map();
  };

  get allSuccess(): ProgressStatus[] {
    return [...this.progressStatus.values()].filter((m) => m.isSuccess);
  }

  get allFailed(): ProgressStatus[] {
    return [...this.progressStatus.values()].filter((m) => m.isFailed);
  }

  updateStatus(fullPath: string, update: Partial<ProgressStatus>): void {
    const value = this.progressStatus.get(fullPath);
    if (!value) return;
    this.progressStatus.set(fullPath, {
      ...value,
      ...update
    });
    this.notifyListener(fullPath);
  }

  listener: () => void = () => {};

  notifyListener(fullPath: string): void {
    if (this.inCurrentDirectory(fullPath)) {
      this.listener();
    }
  }

  inCurrentDirectory = (fullPath: string): boolean => {
    if (!fullPath) return false;
    return (
      fullPath.substring(0, fullPath.lastIndexOf('/') + 1) ===
      this.fs.currentPath
    );
  };
}

export function isFileSystemEntry(
  file: File | FileSystemEntry
): file is FileSystemEntry {
  const f = file as FileSystemEntry;
  return f.isFile !== undefined || f.isDirectory !== undefined;
}
