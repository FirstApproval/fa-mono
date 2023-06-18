import { makeObservable, observable } from 'mobx';

export class SignUpStore {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  code: string = '';

  constructor() {
    makeObservable(this, {
      email: observable,
      firstName: observable,
      lastName: observable,
      password: observable,
      code: observable
    });
  }
}
