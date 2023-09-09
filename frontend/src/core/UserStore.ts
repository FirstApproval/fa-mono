import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { publicationService, userService } from './service';
import { type GetMeResponse } from '../apis/first-approval-api';
import { authStore } from './auth';
import { routerStore } from './router';
import { Page } from './RouterStore';

export class UserStore {
  user: GetMeResponse | undefined = undefined;
  editableUser: GetMeResponse | undefined = undefined;
  deleteProfileImage = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => authStore.token,
      (token) => {
        if (token) {
          this.requestUserData();
        } else {
          this.user = undefined;
          this.editableUser = undefined;
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

  createPublication = async (): Promise<void> => {
    const response = await publicationService.createPublication();
    const pubId: string = response.data.id;
    routerStore.navigatePage(Page.PUBLICATION, `/publication/${pubId}`);
  };
}
