import { makeAutoObservable } from 'mobx';
import { authorService, publicationService } from '../../core/service';
import {
  type Publication,
  PublicationStatus,
  type RecommendedAuthor
} from '../../apis/first-approval-api';

export class HomePageStore {
  isLoadingPublications = false;
  publications: Publication[] = [];

  isLoadingPopularAuthors = false;
  popularAuthors: RecommendedAuthor[] = [];

  isLoadingRecommendedPublications = false;
  recommendedPublications: Publication[] = [];

  constructor() {
    makeAutoObservable(this);
    void this.loadPublications();
    void this.loadPopularAuthors();
    void this.loadRecommendedPublications();
  }

  private async loadPublications(): Promise<void> {
    this.isLoadingPublications = true;
    try {
      const response = await publicationService.getMyPublications(
        PublicationStatus.PENDING,
        0,
        100
      );
      this.publications = response.data.publications ?? [];
      this.recommendedPublications = response.data.publications ?? [];
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
      // const response = await publicationService.getAllFeaturedPublications(
      //   0,
      //   4
      // );
      // this.recommendedPublications = response.data.publications ?? [];
    } finally {
      this.isLoadingRecommendedPublications = false;
    }
  }
}
