import { type PublicationStore } from '../store/PublicationStore';
import { ResearchAreaStore } from '../researcharea/ResearchAreaStore';

export interface EditorProps {
  publicationStore: PublicationStore;
}

export interface ResearchAreaEditorProps {
  publicationStore: PublicationStore;
  researchAreaStore: ResearchAreaStore;
}
