import { makeAutoObservable } from 'mobx';
import { AxiosProgressEvent } from 'axios';

interface ProgressStatus {
  fullPath: string;
  file: File | FileSystemEntry;
  progress: AxiosProgressEvent;
  signal?: AbortSignal;
  isFailed?: boolean;
}

export class UploadProgressStore {
  progressStatus = new Map<string, ProgressStatus>();

  constructor() {
    makeAutoObservable(this);
  }

  get inProgress(): number {
    return [...this.progressStatus.values()].filter(
      (m) => m.progress.progress !== 1
    ).length;
  }

  get count(): number {
    return [...this.progressStatus.keys()].length;
  }

  get success(): number {
    return [...this.progressStatus.values()].filter((m) => !m.isFailed).length;
  }

  get failed(): number {
    return this.allFailed.length;
  }

  clear = (): void => {
    this.progressStatus = new Map();
  };

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
  }
}

export function isFileSystemEntry(
  file: File | FileSystemEntry
): file is FileSystemEntry {
  const f = file as FileSystemEntry;
  return f.isFile !== undefined || f.isDirectory !== undefined;
}
