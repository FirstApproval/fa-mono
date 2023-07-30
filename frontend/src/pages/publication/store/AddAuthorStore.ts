import { makeAutoObservable } from 'mobx';

export class AddAuthorStore {
  email: string = '';
  fistName: string = '';
  lastName: string = '';
  shortBio: string = '';
  constructor() {
    makeAutoObservable(this);
  }
}
