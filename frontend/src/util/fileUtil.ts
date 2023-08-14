// Drop handler function to get all files
export async function getAllFileEntries(
  dataTransferItemList: DataTransferItemList
): Promise<FileSystemEntry[]> {
  const fileEntries = [];
  // Use BFS to traverse entire directory/file structure
  const queue = [];
  // Unfortunately dataTransferItemList is not iterable i.e. no forEach
  for (let i = 0; i < dataTransferItemList.length; i++) {
    // Note webkitGetAsEntry a non-standard feature and may change
    // Usage is necessary for handling directories
    queue.push(dataTransferItemList[i].webkitGetAsEntry());
  }
  while (queue.length > 0) {
    const entry = queue.shift();
    if (entry !== null && entry !== undefined) {
      if (entry.isFile) {
        fileEntries.push(entry);
      } else if (entry.isDirectory) {
        fileEntries.push(entry);
        // @ts-expect-error experimental API
        queue.push(...(await readAllDirectoryEntries(entry.createReader())));
      }
    }
  }
  return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory
// by calling readEntries until it returns empty array
async function readAllDirectoryEntries(
  directoryReader: FileSystemDirectoryReader
): Promise<any[]> {
  const entries = [];
  let readEntries = await readEntriesPromise(directoryReader);
  while (readEntries.length > 0) {
    entries.push(...readEntries);
    readEntries = await readEntriesPromise(directoryReader);
  }
  return entries;
}

// Wrap readEntries in a promise to make working with readEntries easier
// readEntries will return only some of the entries in a directory
// e.g. Chrome returns at most 100 entries at a time
async function readEntriesPromise(
  directoryReader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> {
  try {
    return await new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}
