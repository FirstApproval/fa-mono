export async function calculateSHA256(file: File): Promise<string> {
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
