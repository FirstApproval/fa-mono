import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { publicationService, userService } from './service';
import { type GetMeResponse, Workplace } from '../apis/first-approval-api';
import { authStore } from './auth';
import { routerStore } from './router';
import { ACCOUNT_AFFILIATIONS_PATH, Page } from './RouterStore';
import { WorkplaceProps } from './WorkplaceProps';
import { userStore } from './user';
import { cloneDeep } from 'lodash';

export class UserStore {
  user: GetMeResponse | undefined = undefined;
  editableUser: GetMeResponse | undefined = undefined;
  deleteProfileImage = false;
  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];

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
          this.workplaces = [];
          this.workplacesProps = [];
        }
      },
      { fireImmediately: true }
    );
  }

  public requestUserData(): void {
    void userService.getMe().then((response) => {
      runInAction(() => {
        this.user = response.data;
        this.editableUser = cloneDeep(response.data);
        this.workplaces = cloneDeep(response.data.workplaces ?? []);
        if (!this.workplaces || this.workplaces.length === 0) {
          this.workplaces.push({ isFormer: false });
        }

        this.workplacesProps = [];
        this.workplaces?.forEach((w, index) => {
          this.workplacesProps.push({
            orgQuery: w.organization?.name ?? '',
            departmentQuery: w.department?.name ?? '',
            departmentQueryKey: '',
            organizationOptions: [],
            departmentOptions: w.organization?.departments ?? []
          });
        });
      });
    });
  }

  createPublication = async (): Promise<void> => {
    const workplaces = userStore.user?.workplaces;
    if (!workplaces?.length) {
      routerStore.navigatePage(Page.ACCOUNT, ACCOUNT_AFFILIATIONS_PATH);
    } else {
      const response = await publicationService.createPublication();
      const pubId: string = response.data.id;
      routerStore.navigatePage(Page.PUBLICATION, `/publication/${pubId}`);
    }
  };

  saveWorkplaces = async (workplaces: Workplace[]): Promise<void> => {
    await userService.getMe().then(async (response) => {
      const user = response.data;
      await userService
        .updateUser({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          username: user.username,
          selfInfo: user.selfInfo,
          workplaces
        })
        .then(() => {
          userStore.requestUserData();
        });
    });
  };
}
