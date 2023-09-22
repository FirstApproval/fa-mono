import { makeAutoObservable } from 'mobx';
import { type UserInfo, Workplace } from '../../../apis/first-approval-api';
import { authorService } from '../../../core/service';
import { IWorkplaceStore, WorkplaceProps } from '../../../core/WorkplaceProps';

export class AuthorEditorStore implements IWorkplaceStore {
  id: string | undefined = '';
  userId: string | undefined;
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  shortBio: string = '';
  isConfirmed: boolean = false;
  isNew: boolean = false;
  index?: number;
  profileImage?: string;
  workplaces: Workplace[] = [];
  workplacesProps: WorkplaceProps[] = [];

  constructor() {
    makeAutoObservable(this);
    this.clean();
  }

  clean(): void {
    this.id = '';
    this.userId = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.shortBio = '';
    this.profileImage = '';
    this.index = undefined;
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
