import {
  CollaborationRequestInfo,
  Publication,
} from "../../../apis/first-approval-api"
import { makeAutoObservable } from "mobx"
import { collaborationRequestService } from "../../../core/service"

const PAGE_SIZE = 20;

export class PublicationCollaborationsStore {
  collaborationRequests: CollaborationRequestInfo[] = []
  publication?: Publication;
  isLastPage: Boolean = false;
  currentPage = 0;
  // collaborationRequestCreator: UserInfo | undefined = undefined;
  // publicationCreator: UserInfo | undefined = undefined;
  // messages: CollaborationRequestMessage[] = [];
  // messageType: CollaborationMessageType | undefined = undefined;

  constructor (publicationId: string) {
    makeAutoObservable(this);
    this.loadInitialState(publicationId);
    // // this.loadInitialState(publicationId);
    //
    // if (stage === CollaborationMessageType.CITATION_IS_ENOUGH) {
    //   this.publication = publication;
    //   this.publicationCreator = publication?.creator;
    //   this.collaborationRequestCreator = userStore.user;
    //   this.messages = [
    //     {
    //       id: '',
    //       type: CollaborationMessageType.CITATION_IS_ENOUGH,
    //       isAssistant: true,
    //       text: `The dataset "${publication?.title}" was downloaded.\n\n` +
    //         'This dataset was published in open access by the author(s).\n' +
    //         'If you reuse it in your work, it is enough for you to cite this dataset.'
    //     }
    //   ]
    // }
  }

  private loadInitialState(publicationId: string): void {
    debugger;
    collaborationRequestService.getPublicationCollaborationRequests(publicationId, this.currentPage, PAGE_SIZE)
      .then((response) => {
        debugger;
        const data = response.data;
        this.isLastPage = data.isLastPage;
        this.collaborationRequests.push(...data.collaborationRequests);
      });
  }
}
