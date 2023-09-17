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
  }

  async searchAuthors(query: string): Promise<UserInfo[]> {
    const response = await authorService.getAuthors(query);
    return response.data;
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
  }
}
