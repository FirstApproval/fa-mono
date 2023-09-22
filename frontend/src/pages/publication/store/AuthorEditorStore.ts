import { makeAutoObservable } from 'mobx';
import { Workplace } from '../../../apis/first-approval-api';
import {
  IWorkplaceStore,
  WorkplaceProps,
  WorkplaceValidationState
} from '../../../core/WorkplaceProps';
import { validateEmail } from '../../../util/emailUtil';

export class AuthorEditorStore implements IWorkplaceStore {
  id: string | undefined = '';
  userId: string | undefined;
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
    this.workplaces = [{ isFormer: false }];
    this.workplacesValidation = [
      { isValidOrganization: true, isValidAddress: true }
    ];
    this.workplacesProps = [
      {
        orgQuery: '',
        departmentQuery: '',
        departmentQueryKey: '',
        organizationOptions: [],
        departmentOptions: []
      }
    ];
  }

  validate(): boolean {
    this.isValidEmail = this.email.length > 0 && validateEmail(this.email);
    this.isValidFirstName = this.firstName.length > 0;
    this.isValidLastName = this.lastName.length > 0;
    this.workplacesValidation = this.workplaces.map((workplace) => ({
      isValidOrganization: !!workplace.organization,
      isValidAddress: !!workplace.address
    }));
    // const currentWorkplaceAbsent = !this.workplaces.some(
    //   (workplace) => !workplace.isFormer
    // );
    return (
      this.isValidEmail &&
      this.isValidFirstName &&
      this.isValidLastName &&
      this.workplacesValidation.every(
        (v) => v.isValidOrganization && v.isValidAddress
      )
    );
  }
}
