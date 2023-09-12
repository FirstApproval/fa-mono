export function getTimeElapsedString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();

  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Assuming 30 days per month
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `Last edited ${years} year${years !== 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `Last edited ${months} month${months !== 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `Last edited ${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `Last edited ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `Last edited ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
}
