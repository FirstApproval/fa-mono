import { makeAutoObservable } from 'mobx';
import { type Author } from '../../../apis/first-approval-api';
import { authorService } from '../../../core/service';

export class AuthorEditorStore {
  email: string = '';
  fistName: string = '';
  lastName: string = '';
  shortBio: string = '';
  isUnconfirmed: boolean = false;
  isNew: boolean = false;
  index?: number;
  constructor() {
    makeAutoObservable(this);
  }

  async searchAuthors(query: string): Promise<Author[]> {
    const response = await authorService.getAuthors(query);
    return response.data;
  }

  clean(): void {
    this.email = '';
    this.fistName = '';
    this.lastName = '';
    this.shortBio = '';
    this.index = undefined;
  }
}
