export function TextSizeTruncation(text: string, maxLength: number): string {
  const textLength = text.length;
  if (textLength > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}
