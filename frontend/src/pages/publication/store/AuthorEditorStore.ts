import { makeAutoObservable } from 'mobx';
import { type Author } from '../../../apis/first-approval-api';
import { authorService } from '../../../core/service';

export class AuthorEditorStore {
  id: string | undefined = '';
  userId: string | undefined;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  shortBio: string = '';
  isConfirmed: boolean = false;
  isNew: boolean = false;
  index?: number;
  profileImage?: string;
  constructor() {
    makeAutoObservable(this);
  }

  async searchAuthors(query: string): Promise<Author[]> {
    const response = await authorService.getAuthors(query);
    return response.data;
  }

  clean(): void {
    this.id = '';
    this.userId = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.shortBio = '';
    this.profileImage = '';
    this.index = undefined;
  }
}
