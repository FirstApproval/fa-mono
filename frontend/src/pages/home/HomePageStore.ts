import { makeAutoObservable } from 'mobx';
import { authorService, publicationService } from '../../core/service';
import { type UserInfo, type Publication } from '../../apis/first-approval-api';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';

export class HomePageStore {
  isLoadingPublications = false;
  publications: Publication[] = [];

  isLoadingPopularAuthors = false;
  popularAuthors: UserInfo[] = [];

  isLoadingRecommendedPublications = false;
  recommendedPublications: Publication[] = [];

  searchResults: Publication[] = [];

  isSearching = false;
  searchQuery: string = '';
  inputValue: string = '';

  constructor() {
    makeAutoObservable(this);
    void this.loadPublications();
    void this.loadPopularAuthors();
    void this.loadRecommendedPublications();
  }

  private async loadPublications(): Promise<void> {
    this.isLoadingPublications = true;
    try {
      const response = await publicationService.getAllPublications(0, 25);
      this.publications = response.data.publications ?? [];
    } finally {
      this.isLoadingPublications = false;
    }
  }

  private async loadPopularAuthors(): Promise<void> {
    this.isLoadingPopularAuthors = true;
    try {
      const response = await authorService.getTopAuthors(0, 4);
      this.popularAuthors = response.data.authors ?? [];
    } finally {
      this.isLoadingPopularAuthors = false;
    }
  }

  private async loadRecommendedPublications(): Promise<void> {
    this.isLoadingRecommendedPublications = true;
    try {
      const response = await publicationService.getAllFeaturedPublications(
        0,
        4
      );
      this.recommendedPublications = response.data.publications ?? [];
    } finally {
      this.isLoadingRecommendedPublications = false;
    }
  }

  async search(): Promise<void> {
    this.searchQuery = this.inputValue;
    this.isSearching = true;
    void publicationService
      .searchPublications(this.searchQuery, 10, 0)
      .then((r) => {
        this.searchResults = r.data.items ?? [];
      })
      .catch(() => {
        this.searchResults = [];
      })
      .finally(() => {
        this.isSearching = false;
      });
  }

  createPublication = async (): Promise<void> => {
    const response = await publicationService.createPublication();
    const pubId: string = response.data.id;
    routerStore.navigatePage(Page.PUBLICATION, `/publication/${pubId}`);
  };
}
