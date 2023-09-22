import { PublicationStore } from '../PublicationStore';
import { FileSystemFA } from '../../../../fire-browser/FileSystemFA';
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
  PublicationStatus: {},
  OauthType: {}
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
      {
        initialized: true,
        files: []
      } as unknown as FileSystemFA,
      {
        initialized: true,
        files: []
      } as unknown as FileSystemFA
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
      'This is my granting organization'
    );
    publicationStore.splitGrantingOrganizationsParagraph(0, 4);
    expect(publicationStore.grantingOrganizations[0].text).toBe('This');
    expect(publicationStore.grantingOrganizations[1].text).toBe(
      ' is my granting organization'
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

describe('should correctly merge paragraphs', () => {
  beforeEach(() => {
    mockPublicationPromise = new Promise((resolve) => {
      publicationPromiseResolve = resolve;
    });
    publicationStore = new PublicationStore(
      '',
      {
        initialized: true,
        files: []
      } as unknown as FileSystemFA,
      {
        initialized: true,
        files: []
      } as unknown as FileSystemFA
    );
  });

  test('summary', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.updateSummaryParagraph(0, 'This');
    publicationStore.addSummaryParagraph(1);
    publicationStore.updateSummaryParagraph(1, ' is my summary');
    publicationStore.mergeSummaryParagraph(1);
    expect(publicationStore.summary[0].text).toBe('This is my summary');
    expect(publicationStore.summary[1]).toBe(undefined);
  });

  test('goals', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addExperimentGoalsParagraph(0);
    publicationStore.updateExperimentGoalsParagraph(0, 'This');
    publicationStore.addExperimentGoalsParagraph(1);
    publicationStore.updateExperimentGoalsParagraph(1, ' is my goal');
    publicationStore.mergeExperimentGoalsParagraph(1);
    expect(publicationStore.experimentGoals[0].text).toBe('This is my goal');
    expect(publicationStore.experimentGoals[1]).toBe(undefined);
  });

  test('method', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addMethodParagraph(0);
    publicationStore.updateMethodParagraph(0, 'This');
    publicationStore.addMethodParagraph(1);
    publicationStore.updateMethodParagraph(1, ' is my method');
    publicationStore.mergeMethodParagraph(1);
    expect(publicationStore.method[0].text).toBe('This is my method');
    expect(publicationStore.method[1]).toBe(undefined);
  });

  test('object of study', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addObjectOfStudyParagraph(0);
    publicationStore.updateObjectOfStudyParagraph(0, 'This');
    publicationStore.addObjectOfStudyParagraph(1);
    publicationStore.updateObjectOfStudyParagraph(1, ' is my object');
    publicationStore.mergeObjectOfStudyParagraph(1);
    expect(publicationStore.objectOfStudy[0].text).toBe('This is my object');
    expect(publicationStore.objectOfStudy[1]).toBe(undefined);
  });

  test('software', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addSoftwareParagraph(0);
    publicationStore.updateSoftwareParagraph(0, 'This');
    publicationStore.addSoftwareParagraph(1);
    publicationStore.updateSoftwareParagraph(1, ' is my software');
    publicationStore.mergeSoftwareParagraph(1);
    expect(publicationStore.software[0].text).toBe('This is my software');
    expect(publicationStore.software[1]).toBe(undefined);
  });

  test('granting organizations', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addGrantingOrganization(0);
    publicationStore.updateGrantingOrganization(0, 'This');
    publicationStore.addGrantingOrganization(1);
    publicationStore.updateGrantingOrganization(
      1,
      ' is my granting organization'
    );
    publicationStore.mergeGrantingOrganizationsParagraph(1);
    expect(publicationStore.grantingOrganizations[0].text).toBe(
      'This is my granting organization'
    );
    expect(publicationStore.grantingOrganizations[1]).toBe(undefined);
  });

  test('related articles', async () => {
    publicationPromiseResolve({
      data: { title: 'Research' } as unknown as Publication
    } as unknown as AxiosResponse);

    await waitFor(() => {
      expect(publicationStore.title).toBe('Research');
    });

    publicationStore.addRelatedArticle(0);
    publicationStore.updateRelatedArticle(0, 'This');
    publicationStore.addRelatedArticle(1);
    publicationStore.updateRelatedArticle(1, ' is my related article');
    publicationStore.mergeRelatedArticlesParagraph(1);
    expect(publicationStore.relatedArticles[0].text).toBe(
      'This is my related article'
    );
    expect(publicationStore.relatedArticles[1]).toBe(undefined);
  });
});
