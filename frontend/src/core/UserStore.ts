import {makeAutoObservable, reaction, runInAction} from 'mobx';
import {userService} from './service';
import {
  DataCollectionType,
  type GetMeResponse,
  Workplace
} from '../apis/first-approval-api';
import {authStore} from './auth';
import {routerStore} from './router';
import {
  IWorkplaceStore,
  WorkplaceProps,
  WorkplaceValidationState
} from './WorkplaceProps';
import {userStore} from './user';
import {cloneDeep} from 'lodash';
import {
  affiliationsPath,
  chooseDataCollectionPath,
  contestPath,
  emailPath,
  namePath,
  Page,
  signUpPath
} from './router/constants';
import { PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY } from "../pages/publication/ActionBar"

export class UserStore implements IWorkplaceStore {
  user: GetMeResponse | undefined = undefined;
  editableUser: GetMeResponse | undefined = undefined;
  deleteProfileImage = false;
  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];
  newEmail: string | undefined;
  isSubmitting = false;
  changeEmailConfirmationToken: string | undefined;

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
          this.workplaces.push({});
          this.workplacesValidation.push({
            isValidOrganization: true
          });
        }

        this.workplacesProps = [];
        this.workplaces?.forEach((w, index) => {
          this.workplacesProps.push({
            orgQuery: w.organization?.name ?? '',
            organizationOptions: []
          });
          this.workplacesValidation.push({
            isValidOrganization: true
          });
        });

        if (
          !response.data.email &&
          routerStore.page !== Page.EMAIL_VERIFICATION &&
          routerStore.page !== Page.CHANGE_EMAIL_VERIFICATION
        ) {
          routerStore.navigatePage(Page.EMAIL, emailPath, true);
        }
      });
    });
  }

  getCreatePublicationLink = (): string => {
    if (authStore.token) {
      const workplaces = userStore.user?.workplaces;
      if (!workplaces?.length) {
        return affiliationsPath;
      } else {
        return chooseDataCollectionPath;
      }
    } else {
      return signUpPath;
    }
  };

  goToCreatePublication = (dataCollectionType?: DataCollectionType): void => {
    if (!authStore.token) {
      sessionStorage.setItem(
        PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY,
        dataCollectionType ?? DataCollectionType.GENERAL
      );
      routerStore.navigatePage(Page.SIGN_UP, signUpPath);
      return;
    }

    userService.getMe().then((response) => {
      const user = response.data;
      if (!user?.isNameConfirmed) {
        routerStore.navigatePage(Page.NAME, namePath, true);
      } else if (!user?.isWorkplacesConfirmed || !user?.workplaces?.length) {
        routerStore.navigatePage(Page.AFFILIATIONS, affiliationsPath, true, {
          isRegistration: false
        });
      } else if (!user?.email) {
        routerStore.navigatePage(Page.EMAIL, emailPath, true);
      } else {
        routerStore.navigatePage(
          Page.CHOOSE_DATA_COLLECTION_PAGE,
          chooseDataCollectionPath,
          false,
          {
            dataCollectionType
          }
        );
      }
    });
  };

  getContestLink = (): string => {
    return contestPath;
  };

  goToContestPage = (): void => {
    routerStore.navigatePage(Page.CONTEST_PAGE, contestPath);
  };

  updateUser = async (
    workplaces: Workplace[],
    confirmName = false,
    confirmWorkplaces = false
  ): Promise<void> => {
    await userService
      .updateUser({
        firstName: confirmName
          ? this.editableUser!.firstName
          : this.user!.firstName,
        lastName: confirmName
          ? this.editableUser!.lastName
          : this.user!.lastName,
        middleName: confirmName
          ? this.editableUser!.middleName
          : this.user!.middleName,
        username: confirmName
          ? this.editableUser!.username
          : this.user!.username,
        profileImage: this.editableUser!.profileImage,
        deleteProfileImage: this.deleteProfileImage,
        workplaces: workplaces ?? this.workplaces,
        confirmName,
        confirmWorkplaces
      })
      .then(() => {
        userStore.requestUserData();
      });
  };

  validate(): boolean {
    this.workplacesValidation = this.workplaces.map((workplace) => ({
      isValidOrganization: !!workplace.organization?.name?.length
    }));
    return this.workplacesValidation.every((v) => v.isValidOrganization);
  }

  async confirmChangeEmail(
    code: string,
    confirmationToken: string
  ): Promise<any> {
    return userService
      .confirmChangeEmail({ code, confirmationToken })
      .then(() => {
        this.newEmail = undefined;
        if (authStore.token) {
          this.requestUserData();
        }
      });
  }
}
