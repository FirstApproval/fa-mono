import { type PublicationStore } from '../store/PublicationStore';
import { PublicationPageStore } from "../store/PublicationPageStore"

export interface EditorProps {
  publicationStore: PublicationStore;
}

export interface ResearchAreaEditorProps {
  publicationStore: PublicationStore;
  publicationPageStore: PublicationPageStore;
}
