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
import {
  ResearchAreaElement,
  researchAreaElementsWithLevel,
  researchAreaElementsWithParent,
  ResearchAreaLevel
} from './ResearchAreas';
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
              {researchAreaElementsWithLevel(ResearchAreaLevel.L1).map(
                (element) => {
                  return (
                    <Flex key={element.text} direction={FlexDirection.column}>
                      <ResearchAreaDialogElementContainer
                        element={element}
                        researchAreaStore={props.researchAreaStore}
                      />
                    </Flex>
                  );
                }
              )}
            </DialogContentWrap>
          </DialogContent>
        </DialogWrap>
      </Dialog>
    );
  }
);

const ResearchAreaDialogElementContainer = observer(
  (props: ResearchAreaDialogElementProps): ReactElement => {
    return (
      <>
        <ResearchAreaDialogElement
          element={props.element}
          researchAreaStore={props.researchAreaStore}
        />
        <HeightElement value={'8px'} />
      </>
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
        {props.researchAreaStore.isElementSelected(props.element) && (
          <Flex direction={FlexDirection.column}>
            <ResearchAreaDialogSelectedElementWrap
              onClick={() => props.researchAreaStore.check(props.element)}>
              <ResearchAreaDialogElementContent
                checked={true}
                element={props.element}
              />
            </ResearchAreaDialogSelectedElementWrap>
            {props.element.hasChildren && <HeightElement value={'8px'} />}
            {props.element.hasChildren &&
              researchAreaElementsWithParent(props.element.text).map(
                (element) => {
                  return (
                    <ResearchAreaDialogElementContainer
                      key={element.text}
                      element={element}
                      researchAreaStore={props.researchAreaStore}
                    />
                  );
                }
              )}
          </Flex>
        )}

        {!props.researchAreaStore.isElementSelected(props.element) && (
          <Flex onClick={() => props.researchAreaStore.check(props.element)}>
            <ResearchAreaDialogElementContent
              checked={false}
              element={props.element}
            />
          </Flex>
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
        <ResearchAreaDialogElementWrap level={props.element.level}>
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

const ResearchAreaDialogElementWrap = styled.div<{ level: ResearchAreaLevel }>`
  border-radius: 4px;
  padding: 8px 16px 8px
    ${(props) =>
      props.level === ResearchAreaLevel.L1
        ? 8
        : props.level === ResearchAreaLevel.L2
        ? 40
        : props.level === ResearchAreaLevel.L3
        ? 72
        : 72}px;
  width: 568px;

  &:hover {
    background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
  }
`;

const DialogWrap = styled.div`
  width: 600px;
  height: 600px;
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
