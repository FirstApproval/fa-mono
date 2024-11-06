import {
  AuthApi,
  AuthorApi,
  CollaborationRequestApi,
  Configuration,
  FileApi,
  OrganizationApi,
  PublicationApi,
  RegistrationApi,
  ReportApi,
  SampleFileApi,
  UserApi,
  VisitorApi
} from '../apis/first-approval-api';
import { SampleFileServiceAdapter } from './SampleFileServiceAdapter';
import { authStore } from './auth';

const configuration: Configuration = new Configuration({
  accessToken: async () => {
    if (authStore.token) {
      return authStore.token;
    } else {
      throw Error('No auth token set');
    }
  }
});

export const registrationService = new RegistrationApi(configuration);

export const userService = new UserApi(configuration);

export const authorService = new AuthorApi(configuration);

export const authService = new AuthApi(configuration);

export const fileService = new FileApi(configuration);

export const sampleFileServiceRaw = new SampleFileApi(configuration);

export const sampleFileService = new SampleFileServiceAdapter();

export const publicationService = new PublicationApi(configuration);

export const organizationService = new OrganizationApi(configuration);

export const reportService = new ReportApi(configuration);

export const visitorService = new VisitorApi(configuration);

export const collaborationRequestService = new CollaborationRequestApi(
  configuration
);
