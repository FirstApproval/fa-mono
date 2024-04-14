import { action, makeAutoObservable } from 'mobx';
import { collaboratorService, publicationService } from '../../../core/service';
import { CollaboratorInfo, UserInfo } from '../../../apis/first-approval-api';

export class CollaboratorsStore {
  open = false;
  publicationId: string = '';
  collaboratorsCount: number = 0;
  collaborators: CollaboratorInfo[] = [];
  collaboratorsIsLastPage = false;

  loadCollaboratorsLocked = false;

  constructor() {
    makeAutoObservable(this);
  }

  public loadDownloaders(page: number): void {
    if (!this.loadCollaboratorsLocked) {
      this.loadCollaboratorsLocked = true;
      void collaboratorService
        .getPublicationCollaborators(this.publicationId, page, 15)
        .then(
          action((response) => {
            this.collaborators = [
              ...this.collaborators,
              ...(response.data.collaborators ?? [])
            ];
            this.collaboratorsIsLastPage = response.data.isLastPage;
            this.loadCollaboratorsLocked = false;
          })
        );
    }
  }

  public clearAndOpen(
    publicationId: string,
    collaboratorsCount: number | null | undefined
  ): void {
    this.publicationId = '';
    this.collaboratorsCount = 0;
    this.collaborators = [];
    this.collaboratorsIsLastPage = false;

    this.publicationId = publicationId;
    this.collaboratorsCount = collaboratorsCount ?? 0;
    this.open = true;
  }
}
