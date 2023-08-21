import { makeAutoObservable, observable, reaction, runInAction } from 'mobx';
import { userService } from './service';
import { type GetMeResponse } from '../apis/first-approval-api';
import { authStore } from './auth';

export class UserStore {
  user: GetMeResponse | undefined = undefined;
  editableUser: GetMeResponse | undefined = undefined;
  constructor() {
    makeAutoObservable(this, { user: observable });
    reaction(
      () => authStore.token,
      (token) => {
        if (token) {
          this.requestUserData();
        }
      },
      { fireImmediately: true }
    );
  }

  public requestUserData(): void {
    void userService.getMe().then((response) => {
      runInAction(() => {
        this.user = response.data;
        this.editableUser = response.data;
      });
    });
  }
}
