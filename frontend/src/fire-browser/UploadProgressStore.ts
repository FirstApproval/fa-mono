import { makeAutoObservable } from 'mobx';
import { AxiosProgressEvent } from 'axios';

export class UploadProgressStore {
  progressMetadata = new Map<
    string,
    { fileName: string; metadata: AxiosProgressEvent }
  >();

  constructor() {
    makeAutoObservable(this);
  }

  get inProgress(): number {
    return [...this.progressMetadata.values()].filter(
      (m) => m.metadata.progress !== 1
    ).length;
  }

  get count(): number {
    return [...this.progressMetadata.keys()].length;
  }

  clear = (): void => {
    this.progressMetadata = new Map();
  };
}
