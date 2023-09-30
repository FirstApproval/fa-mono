import React, { type ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { ResearchAreaStore } from './ResearchAreaStore';
import { ResearchAreaPlaceholder } from './ResearchAreaPlaceholder';
import { ResearchAreaList } from './ResearchAreaList';
import { CursorPointer } from '../../common.styled';
import { ResearchAreaDialog } from './ResearchAreaDialog';

export interface ResearchAreaProps {
  researchAreaStore: ResearchAreaStore;
}

export const ResearchArea = observer(
  (props: ResearchAreaProps): ReactElement => {
    return (
      <>
        {props.researchAreaStore.publicationStore.isReadonly && (
          <ResearchAreaList
            researchAreas={props.researchAreaStore.researchAreas}
          />
        )}

        {!props.researchAreaStore.publicationStore.isReadonly &&
          !props.researchAreaStore.isInitialized && (
            <ResearchAreaPlaceholder
              onClick={props.researchAreaStore.openDialog}
            />
          )}

        {!props.researchAreaStore.publicationStore.isReadonly &&
          props.researchAreaStore.isInitialized && (
            <CursorPointer
              tabIndex={0}
              onClick={props.researchAreaStore.openDialog}>
              <ResearchAreaList
                researchAreas={props.researchAreaStore.researchAreas}
              />
            </CursorPointer>
          )}

        <ResearchAreaDialog researchAreaStore={props.researchAreaStore} />
      </>
    );
  }
);
