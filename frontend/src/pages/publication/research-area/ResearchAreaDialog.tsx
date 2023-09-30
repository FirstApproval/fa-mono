import React, { type ReactElement } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { observer } from 'mobx-react-lite';
import { ResearchAreaProps } from './ResearchArea';
import styled from '@emotion/styled';
import { C3B4EFF, C68676E, Color_040036 } from '../../../ui-kit/colors';
import {
  Typography_16_400,
  Typography_24_600
} from '../../../ui-kit/typography';
import {
  Flex,
  FlexAlignItems,
  FlexDirection,
  FlexJustifyContent
} from '../../../ui-kit/flex';
import { Check, Close } from '@mui/icons-material';
import {
  CursorPointer,
  HeightElement,
  WidthElement
} from '../../common.styled';
import { ResearchAreaElement, researchAreaElements } from './ResearchAreas';
import { ResearchAreaStore } from './ResearchAreaStore';

export const ResearchAreaDialog = observer(
  (props: ResearchAreaProps): ReactElement => {
    return (
      <Dialog
        open={props.researchAreaStore.isDialogOpened}
        onClose={props.researchAreaStore.closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogWrap>
          <DialogTitle id="alert-dialog-title" style={{ padding: 0 }}>
            <DialogTitleWrap>
              <Flex
                alignItems={FlexAlignItems.center}
                justifyContent={FlexJustifyContent.spaceBetween}>
                <Color_040036>
                  <Typography_24_600>
                    Choose 1 or more research areas
                  </Typography_24_600>
                </Color_040036>
                <CursorPointer>
                  <Flex alignItems={FlexAlignItems.center}>
                    <Close
                      onClick={props.researchAreaStore.closeDialog}
                      htmlColor={C68676E}
                    />
                  </Flex>
                </CursorPointer>
              </Flex>
            </DialogTitleWrap>
          </DialogTitle>
          <DialogContent style={{ padding: 0 }}>
            <DialogContentWrap>
              {researchAreaElements().map((element) => {
                return (
                  <Flex key={element.text} direction={FlexDirection.column}>
                    <Flex
                      onClick={() =>
                        props.researchAreaStore.select(element.text)
                      }>
                      <ResearchAreaDialogElement
                        element={element}
                        researchAreaStore={props.researchAreaStore}
                      />
                    </Flex>
                    <HeightElement value={'8px'} />
                  </Flex>
                );
              })}
            </DialogContentWrap>
          </DialogContent>
        </DialogWrap>
      </Dialog>
    );
  }
);

export interface ResearchAreaDialogElementProps {
  element: ResearchAreaElement;
  researchAreaStore: ResearchAreaStore;
}

const ResearchAreaDialogElement = observer(
  (props: ResearchAreaDialogElementProps): ReactElement => {
    return (
      <>
        {props.researchAreaStore.isElementSelected(props.element.text) && (
          <ResearchAreaDialogSelectedElementWrap>
            <ResearchAreaDialogElementContent
              checked={true}
              element={props.element}
            />
          </ResearchAreaDialogSelectedElementWrap>
        )}

        {!props.researchAreaStore.isElementSelected(props.element.text) && (
          <ResearchAreaDialogElementContent
            checked={false}
            element={props.element}
          />
        )}
      </>
    );
  }
);

export interface ResearchAreaDialogContentProps {
  checked: boolean;
  element: ResearchAreaElement;
}

const ResearchAreaDialogElementContent = observer(
  (props: ResearchAreaDialogContentProps): ReactElement => {
    return (
      <CursorPointer>
        <ResearchAreaDialogElementWrap>
          <Flex
            alignItems={FlexAlignItems.center}
            justifyContent={FlexJustifyContent.spaceBetween}>
            <Flex alignItems={FlexAlignItems.center}>
              <Flex alignItems={FlexAlignItems.center}>
                {props.element.icon}
                <WidthElement value={'16px'} />
              </Flex>
              <Color_040036>
                <Typography_16_400>{props.element.text}</Typography_16_400>
              </Color_040036>
            </Flex>
            {props.checked && (
              <Flex alignItems={FlexAlignItems.center}>
                <Check htmlColor={C3B4EFF} />
              </Flex>
            )}
          </Flex>
        </ResearchAreaDialogElementWrap>
      </CursorPointer>
    );
  }
);

const ResearchAreaDialogSelectedElementWrap = styled.div`
  border-radius: 4px;
  background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
`;

const ResearchAreaDialogElementWrap = styled.div`
  border-radius: 4px;
  padding: 8px 16px;
  width: 568px;

  &:hover {
    background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
  }
`;

const DialogWrap = styled.div`
  width: 600px;
  height: 620px;
  padding: 32px 16px;
`;

const DialogTitleWrap = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 32px;
`;

const DialogContentWrap = styled.div`
  width: 100%;
`;
