import { type PublicationStore } from '../store/PublicationStore';

export interface EditorProps {
  publicationStore: PublicationStore;
  header?: string;
  booleanField?: keyof PublicationStore;
  textField?: keyof PublicationStore;
  textFieldPlaceHolder?: string;
}
