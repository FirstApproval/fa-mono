import { PublicationStore } from '../PublicationStore';
import { ChonkyFileSystem } from '../../../../fire-browser/ChonkyFileSystem';
import { ChonkySampleFileSystem } from '../../../../fire-browser/sample-files/ChonkySampleFileSystem';
import { type Publication } from '../../../../apis/first-approval-api';
import { waitFor } from '@testing-library/react';
import { AxiosResponse } from 'axios';

jest.mock('../../../../core/service', () => ({
  publicationService: {
    getPublication: async () => await mockPublicationPromise,
    editPublication: async () => await Promise.resolve()
  }
}));
jest.mock('../../../../apis/first-approval-api', () => ({
  PublicationStatus: {}
}));

let publicationStore: PublicationStore;
let mockPublicationPromise: Promise<AxiosResponse<Publication>>;
let publicationPromiseResolve: (value: AxiosResponse<Publication>) => void;

describe('should correctly split paragraphs', () => {
  beforeEach(() => {
    mockPublicationPromise = new Promise((resolve) => {
      publicationPromiseResolve = resolve;
    });
    publicationStore = new PublicationStore(
      '',
      { initialized: true, files: [] } as unknown as ChonkyFileSystem,
      { initialized: true, files: [] } as unknown as ChonkySampleFileSystem
    );
  });

  test('summary', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addSummaryParagraph(0);
    publicationStore.updateSummaryParagraph(0, 'This is my summary');
    publicationStore.splitSummaryParagraph(0, 4);
    expect(publicationStore.summary[0].text).toBe('This');
    expect(publicationStore.summary[1].text).toBe(' is my summary');
  });

  test('goals', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addExperimentGoalsParagraph(0);
    publicationStore.updateExperimentGoalsParagraph(0, 'This is my goal');
    publicationStore.splitExperimentGoalsParagraph(0, 4);
    expect(publicationStore.experimentGoals[0].text).toBe('This');
    expect(publicationStore.experimentGoals[1].text).toBe(' is my goal');
  });

  test('method', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addMethodParagraph(0);
    publicationStore.updateMethodParagraph(0, 'This is my method');
    publicationStore.splitMethodParagraph(0, 4);
    expect(publicationStore.method[0].text).toBe('This');
    expect(publicationStore.method[1].text).toBe(' is my method');
  });

  test('object of study', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addObjectOfStudyParagraph(0);
    publicationStore.updateObjectOfStudyParagraph(0, 'This is my object');
    publicationStore.splitObjectOfStudyParagraph(0, 4);
    expect(publicationStore.objectOfStudy[0].text).toBe('This');
    expect(publicationStore.objectOfStudy[1].text).toBe(' is my object');
  });

  test('software', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addSoftwareParagraph(0);
    publicationStore.updateSoftwareParagraph(0, 'This is my software');
    publicationStore.splitSoftwareParagraph(0, 4);
    expect(publicationStore.software[0].text).toBe('This');
    expect(publicationStore.software[1].text).toBe(' is my software');
  });

  test('granting organizations', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addGrantingOrganization(0);
    publicationStore.updateGrantingOrganization(
      0,
      'This is my related granting organization'
    );
    publicationStore.splitGrantingOrganizationsParagraph(0, 4);
    expect(publicationStore.grantingOrganizations[0].text).toBe('This');
    expect(publicationStore.grantingOrganizations[1].text).toBe(
      ' is my related granting organization'
    );
  });

  test('related articles', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addRelatedArticle(0);
    publicationStore.updateRelatedArticle(0, 'This is my related article');
    publicationStore.splitRelatedArticlesParagraph(0, 4);
    expect(publicationStore.relatedArticles[0].text).toBe('This');
    expect(publicationStore.relatedArticles[1].text).toBe(
      ' is my related article'
    );
  });
});
