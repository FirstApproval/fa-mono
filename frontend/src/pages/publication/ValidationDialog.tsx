import React, { type ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Dialog, DialogContent, styled } from '@mui/material';
import { type PublicationStore, type Section } from './store/PublicationStore';
import {
  FilesPlaceholder,
  MethodPlaceholder,
  ObjectOfStudyPlaceholder,
  PredictedGoalsPlaceholder,
  TagsPlaceholder
} from './ContentPlaceholder';

export const ValidationDialog = (props: {
  publicationStore: PublicationStore;
  isOpen: boolean;
  errors: Section[];
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onClose, errors, publicationStore } = props;
  const {
    openPredictedGoals,
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
        {errors.includes('goals') && (
          <PredictedGoalsPlaceholder
            isReadonly
            onClick={() => {
              onClose();
              openPredictedGoals();
            }}
          />
        )}
        {errors.includes('method') && (
          <MethodPlaceholder
            isReadonly
            onClick={() => {
              onClose();
              openMethod();
            }}
          />
        )}
        {errors.includes('object_of_study') && (
          <ObjectOfStudyPlaceholder
            isReadonly
            onClick={() => {
              onClose();
              openObjectOfStudy();
            }}
          />
        )}
        {errors.includes('files') && (
          <FilesPlaceholder
            isReadonly
            onClick={() => {
              onClose();
              openFiles();
            }}
          />
        )}
        {errors.includes('tags') && (
          <TagsPlaceholder
            isReadonly
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
