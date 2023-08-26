import React, { type ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Dialog, DialogContent, styled } from '@mui/material';
import { type PublicationStore, type Section } from './store/PublicationStore';
import {
  FilesPlaceholder,
  MethodPlaceholder,
  ObjectOfStudyPlaceholder,
  ExperimentGoalsPlaceholder,
  SummaryPlaceholder,
  TagsPlaceholder,
  TitlePlaceholder
} from './ContentPlaceholder';

export const ValidationDialog = (props: {
  publicationStore: PublicationStore;
  isOpen: boolean;
  errors: Section[];
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onClose, errors, publicationStore } = props;
  const {
    openExperimentGoals,
    openMethod,
    openObjectOfStudy,
    openFiles,
    openTags
  } = publicationStore;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        Fill in all the required sections:
      </DialogTitle>
      <DialogContentWrap>
        {errors.includes('title') && (
          <TitlePlaceholder
            onClick={() => {
              onClose();
            }}
          />
        )}
        {errors.includes('summary') && (
          <SummaryPlaceholder
            onClick={() => {
              onClose();
            }}
          />
        )}
        {errors.includes('goals') && (
          <ExperimentGoalsPlaceholder
            onClick={() => {
              onClose();
              openExperimentGoals();
            }}
          />
        )}
        {errors.includes('method') && (
          <MethodPlaceholder
            onClick={() => {
              onClose();
              openMethod();
            }}
          />
        )}
        {errors.includes('object_of_study') && (
          <ObjectOfStudyPlaceholder
            onClick={() => {
              onClose();
              openObjectOfStudy();
            }}
          />
        )}
        {errors.includes('files') && (
          <FilesPlaceholder
            onClick={() => {
              onClose();
              openFiles();
            }}
          />
        )}
        {errors.includes('tags') && (
          <TagsPlaceholder
            onClick={() => {
              onClose();
              openTags();
            }}
          />
        )}
      </DialogContentWrap>
    </Dialog>
  );
};

const DialogContentWrap = styled(DialogContent)`
  min-width: 600px;
`;
