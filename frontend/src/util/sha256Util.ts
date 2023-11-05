import { sha256 } from 'js-sha256';

export async function calculateSHA256(file: File): Promise<string> {
  if (file.size > 500 * 1024 * 1024) {
    return sha256ForFileByParts(file);
  } else {
    return sha256ForFile(file);
  }
}

export async function sha256ForFileByParts(file: File): Promise<string> {
  return new Promise((resolve) => {
    const chunkSize = 10 * 1024 * 1024;
    const hash = sha256.create();

    const calculateChunk = (start: number): void => {
      const reader = new FileReader();
      const blob = file.slice(start, start + chunkSize);

      reader.onload = function (event) {
        const data = event.target!.result as ArrayBuffer;
        hash.update(new Uint8Array(data));

        if (start + chunkSize < file.size) {
          calculateChunk(start + chunkSize);
        } else {
          const hashArray = Array.from(new Uint8Array(hash.arrayBuffer()));
          resolve(btoa(String.fromCharCode(...hashArray)));
        }
      };
      reader.readAsArrayBuffer(blob);
    };
    calculateChunk(0);
  });
}

export async function sha256ForFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const arrayBuffer: any = this.result;
      crypto.subtle
        .digest('SHA-256', arrayBuffer)
        .then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          resolve(btoa(String.fromCharCode.apply(null, hashArray)));
        })
        .catch(reject);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
}
