import { action, makeAutoObservable } from "mobx"
import { academicSupervisorLetterService } from "../../../core/service"
import { AcademicSupervisorLetter } from "../../../apis/first-approval-api"
import { AxiosResponse } from "axios"

export class AcademicSupervisorLettersStore {
  publicationId: string | undefined;
  letterToDelete: AcademicSupervisorLetter | null = null;
  academicSupervisorLetters: AcademicSupervisorLetter [] = [];

  constructor (publicationId: string) {
    makeAutoObservable(this)
    debugger;
    this.publicationId = publicationId;
    this.loadCollaborationRequests(publicationId);
  }

  upload = (academicSupervisorName: string, file: File): Promise<void> => {
    return academicSupervisorLetterService
      .uploadAcademicSupervisorLetter(this.publicationId!, academicSupervisorName, file)
      .then((response: AxiosResponse<AcademicSupervisorLetter>) => {
        const letter = response.data;
        this.academicSupervisorLetters.push(letter);
      });
  }

  download = (letter: AcademicSupervisorLetter): Promise<void> => {
    return academicSupervisorLetterService.downloadAcademicSupervisorLetter(
      this.publicationId!,
      letter.id
    ).then(response => {
      const downloadLink = document.createElement('a');
      downloadLink.href = response.data;
      downloadLink.download = letter.fileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }

  setLetterToDelete(letter: AcademicSupervisorLetter) {
    this.letterToDelete = letter;
  }

  delete = (): Promise<void> => {
    return academicSupervisorLetterService.deleteAcademicSupervisorLetter(
      this.publicationId!,
      this.letterToDelete!.id
    ).then(response => {
      if (response.status === 200) {
        this.academicSupervisorLetters = this.academicSupervisorLetters.filter(
          letter => letter.id !== this.letterToDelete!.id
        );
        this.letterToDelete = null;
      }
    });
  }


  private loadCollaborationRequests (publicationId: string): void {
    void academicSupervisorLetterService
      .getAcademicSupervisorLetters(publicationId)
      .then(
        action((response: AxiosResponse<AcademicSupervisorLetter[]>) => {
          const letters = response.data;
          this.academicSupervisorLetters.push(...letters)
        })
      )
  }

  clear (): void {
    this.academicSupervisorLetters = [];
  }
}
