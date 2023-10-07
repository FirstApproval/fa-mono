import { makeAutoObservable } from 'mobx';
import { UserInfo, Workplace } from '../../../apis/first-approval-api';
import {
  IWorkplaceStore,
  WorkplaceProps,
  WorkplaceValidationState
} from '../../../core/WorkplaceProps';
import { validateEmail } from '../../../util/emailUtil';

export class AuthorEditorStore implements IWorkplaceStore {
  id: string | undefined = '';
  user: UserInfo | undefined;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  shortBio: string = '';
  profileImage?: string;
  isConfirmed: boolean = false;
  isNew: boolean = false;
  index?: number;
  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];

  isValidEmail = true;
  isValidFirstName = true;
  isValidLastName = true;
  workplacesValidation: WorkplaceValidationState[] = [];

  constructor() {
    makeAutoObservable(this);
    this.workplacesValidation = [{ isValidOrganization: true }];
    this.workplaces = [{ isFormer: false }];
    this.workplacesProps = [
      {
        orgQuery: '',
        orgQueryKey: '',
        organizationOptions: []
      }
    ];
  }

  validate(): boolean {
    this.isValidEmail = this.email.length > 0 && validateEmail(this.email);
    this.isValidFirstName = this.firstName.length > 0;
    this.isValidLastName = this.lastName.length > 0;
    this.workplacesValidation = this.workplaces.map((workplace) => ({
      isValidOrganization: !!workplace.organization
    }));
    // const currentWorkplaceAbsent = !this.workplaces.some(
    //   (workplace) => !workplace.isFormer
    // );
    return (
      this.isValidEmail &&
      this.isValidFirstName &&
      this.isValidLastName &&
      this.workplacesValidation.every((v) => v.isValidOrganization)
    );
  }
}
