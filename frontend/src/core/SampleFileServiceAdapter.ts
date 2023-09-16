import {
  CheckFileDuplicatesRequest,
  CreateFolderRequest,
  DeleteByIdsRequest,
  DownloadTokenResponse,
  EditFileRequest,
  FileApi,
  MoveFileRequest,
  PublicationFile,
  SampleFileApi,
  UploadType
} from '../apis/first-approval-api';
import { sampleFileServiceRaw } from './service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class SampleFileServiceAdapter
  implements Omit<FileApi, 'configuration'>
{
  private readonly service: SampleFileApi = sampleFileServiceRaw;

  async checkFileDuplicates(
    publicationId: string,
    checkFileDuplicatesRequest?: CheckFileDuplicatesRequest,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<Record<string, boolean>>> {
    return await this.service.checkSampleFileDuplicates(
      publicationId,
      checkFileDuplicatesRequest
    );
  }

  async createFolder(
    publicationId: string,
    createFolderRequest: CreateFolderRequest,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<PublicationFile>> {
    return await this.service.createFolderForSampleFile(
      publicationId,
      createFolderRequest,
      options
    );
  }

  async deleteFiles(
    deleteByIdsRequest?: DeleteByIdsRequest,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<void>> {
    return await this.service.deleteSampleFiles(deleteByIdsRequest, options);
  }

  async downloadPublicationFile(
    fileId: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<string>> {
    return await this.service.getPublicationSampleFileDownloadLink(
      fileId,
      options
    );
  }

  async editFile(
    id: string,
    editFileRequest: EditFileRequest,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<void>> {
    return await this.service.editSampleFile(id, editFileRequest, options);
  }

  async getDownloadLinkForPublicationFile(
    id: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<string>> {
    return await this.service.getPublicationSampleFileDownloadLink(id, options);
  }

  async getPublicationFiles(
    publicationId: string,
    dirPath: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<PublicationFile[]>> {
    return await this.service.getPublicationSampleFiles(
      publicationId,
      dirPath,
      options
    );
  }

  async getTokenToRetrieveDownloadLink(
    fileId: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<DownloadTokenResponse>> {
    throw new Error('Not implemented');
  }

  async moveFile(
    id: string,
    moveFileRequest: MoveFileRequest,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<void>> {
    return await this.service.moveSampleFile(id, moveFileRequest, options);
  }

  async uploadFile(
    publicationId: string,
    fullPath: string,
    isDir: boolean,
    type: UploadType,
    sha256HexBase64?: string,
    contentLength?: number,
    body?: File,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<PublicationFile>> {
    return await this.service.uploadSampleFile(
      publicationId,
      fullPath,
      isDir,
      type,
      sha256HexBase64,
      contentLength,
      body,
      options
    );
  }
}
