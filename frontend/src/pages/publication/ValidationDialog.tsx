import React, { type ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Dialog, DialogContent, styled } from '@mui/material';
import { type Section } from './store/PublicationStore';
import {
  ExperimentGoalsPlaceholder,
  FilesPlaceholder,
  MethodPlaceholder,
  DataDescriptionPlaceholder,
  SummaryPlaceholder,
  TitlePlaceholder
} from './ContentPlaceholder';
import { PublicationPageStore } from './store/PublicationPageStore';

export const ValidationDialog = (props: {
  publicationPageStore: PublicationPageStore;
  isOpen: boolean;
  errors: Section[];
  onClose: () => void;
}): ReactElement => {
  const { isOpen, onClose, errors, publicationPageStore } = props;
  const { openExperimentGoals, openMethod, openDataDescription, openFiles } =
    publicationPageStore;
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
        {errors.includes('data_description') && (
          <DataDescriptionPlaceholder
            onClick={() => {
              onClose();
              openDataDescription();
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

        <div
          style={{
            marginTop: 24,
            padding: 16,
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 400,
            borderRadius: 4,
            background: 'rgba(59, 78, 255, 0.04)'
          }}>
          Required sections help your work be understood and utilized to its
          fullest potential by other researchers. Completing them also enhances
          your recognition as an author.
        </div>
      </DialogContentWrap>
    </Dialog>
  );
};

const DialogContentWrap = styled(DialogContent)`
  min-width: 600px;
`;
