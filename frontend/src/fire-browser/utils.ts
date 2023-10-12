export function extractFilenameFromContentDisposition(
  contentDisposition: string
): string | null {
  const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = regex.exec(contentDisposition);

  if (matches?.[1]) {
    let filename = matches[1];
    if (filename.startsWith('"') && filename.endsWith('"')) {
      // Remove surrounding double quotes
      filename = filename.slice(1, -1);
    }
    return filename;
  }

  return null; // No filename found
}

export function calculatePathChain(currentPath: string): string[] {
  const pathSegments = currentPath.split('/').filter(Boolean);
  let pathChain = '';
  const pathChainList = [];

  for (const segment of pathSegments) {
    pathChain += `/${segment}`;
    pathChainList.push(pathChain);
  }

  return [...pathChainList];
}

export const fullPathToName = (fullPath: string): string => {
  return fullPath.substring(fullPath.lastIndexOf('/') + 1);
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(text);
  } else {
    document.execCommand('copy', true, text);
  }
};
