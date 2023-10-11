import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { userService } from './service';
import { type GetMeResponse, Workplace } from '../apis/first-approval-api';
import { authStore } from './auth';
import { routerStore } from './router';
import {
  IWorkplaceStore,
  WorkplaceProps,
  WorkplaceValidationState
} from './WorkplaceProps';
import { userStore } from './user';
import { cloneDeep } from 'lodash';
import {
  affiliationsPath,
  namePath,
  Page,
  publicationPath,
  signUpPath
} from './router/constants';

export class UserStore implements IWorkplaceStore {
  user: GetMeResponse | undefined = undefined;
  editableUser: GetMeResponse | undefined = undefined;
  deleteProfileImage = false;
  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];

  workplacesValidation: WorkplaceValidationState[] = [];

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
          this.workplacesValidation.push({
            isValidOrganization: true
          });
        }

        this.workplacesProps = [];
        this.workplaces?.forEach((w, index) => {
          this.workplacesProps.push({
            orgQuery: w.organization?.name ?? '',
            orgQueryKey: '',
            organizationOptions: []
          });
          this.workplacesValidation.push({
            isValidOrganization: true
          });
        });
      });
    });
  }

  createPublication = async (): Promise<void> => {
    const workplaces = userStore.user?.workplaces;
    debugger;
    if (!userStore.user?.isNameConfirmed) {
      routerStore.navigatePage(Page.NAME, namePath, true);
    } else if (!workplaces?.length) {
      routerStore.navigatePage(Page.AFFILIATIONS, affiliationsPath, true, {
        isRegistration: false
      });
    } else {
      routerStore.navigatePage(Page.PUBLICATION, publicationPath);
    }
  };

  getCreatePublicationLink = (): string => {
    if (authStore.token) {
      debugger;
      const workplaces = userStore.user?.workplaces;
      if (!workplaces?.length) {
        return affiliationsPath;
      } else {
        return publicationPath;
      }
    } else {
      return signUpPath;
    }
  };

  goToCreatePublication = (): void => {
    if (authStore.token) {
      void userStore.createPublication();
    } else {
      routerStore.navigatePage(Page.SIGN_UP);
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
          workplaces
        })
        .then(() => {
          userStore.requestUserData();
        });
    });
  };

  updateUser = async (
    workplaces: Workplace[],
    confirmName: boolean
  ): Promise<void> => {
    await userService.updateUser({
      firstName: this.editableUser!.firstName,
      lastName: this.editableUser!.lastName,
      middleName: this.editableUser!.middleName,
      username: this.editableUser!.username,
      confirmName,
      workplaces: workplaces != null ? workplaces : this.workplaces
    });
  };

  validate(): boolean {
    this.workplacesValidation = this.workplaces.map((workplace) => ({
      isValidOrganization: !!workplace.organization
    }));
    // const currentWorkplaceAbsent = !this.workplaces.some(
    //   (workplace) => !workplace.isFormer
    // );
    return this.workplacesValidation.every((v) => v.isValidOrganization);
  }
}
