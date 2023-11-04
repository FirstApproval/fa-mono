import { sha256 } from 'js-sha256';

export async function calculateSHA256(file: File): Promise<string> {
  return new Promise((resolve) => {
    const chunkSize = 10 * 1024 * 1024; // Размер куска (5 МБ в данном случае)
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
