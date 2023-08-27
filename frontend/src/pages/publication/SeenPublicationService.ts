import { publicationService } from '../../core/service';

const SEEN_PUBLICATIONS_LOCAL_STORAGE_KEY = 'seen_publications';

export const incrementPublicationViewCounter = (
  publicationId: string
): void => {
  const seenStorageValue = localStorage.getItem(
    SEEN_PUBLICATIONS_LOCAL_STORAGE_KEY
  );
  let seen: string[];
  if (seenStorageValue) {
    seen = JSON.parse(seenStorageValue);
  } else {
    seen = [];
  }
  if (!seen.includes(publicationId)) {
    void publicationService.incrementPublicationViewCount(publicationId);
    localStorage.setItem(
      SEEN_PUBLICATIONS_LOCAL_STORAGE_KEY,
      JSON.stringify([publicationId, ...seen])
    );
  }
};
