import { makeAutoObservable } from 'mobx';
import { type Author } from '../../../apis/first-approval-api';
import { authorService } from '../../../core/service';

export class AddAuthorStore {
  email: string = '';
  fistName: string = '';
  lastName: string = '';
  shortBio: string = '';
  constructor() {
    makeAutoObservable(this);
  }

  async searchAuthors(query: string): Promise<Author[]> {
    const response = await authorService.getAuthors(query);
    return response.data;
  }
}
