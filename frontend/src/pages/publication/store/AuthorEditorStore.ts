import { makeAutoObservable } from 'mobx';
import { Workplace } from '../../../apis/first-approval-api';
import { IWorkplaceStore, WorkplaceProps } from '../../../core/WorkplaceProps';

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

  constructor() {
    makeAutoObservable(this);
    this.workplaces = [{ isFormer: false }];
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
}
