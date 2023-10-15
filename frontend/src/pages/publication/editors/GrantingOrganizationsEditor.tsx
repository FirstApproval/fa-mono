import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphPrefixType } from './element/ListElement';

import { ListContentEditor } from './ListContentEditor';

export const GrantingOrganizationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <ListContentEditor
        isReadonly={props.publicationStore.isReadonly}
        value={props.publicationStore.grantingOrganizations}
        onChange={(idx, value) => {
          props.publicationStore.updateGrantingOrganization(idx, value);
        }}
        onAddParagraph={(idx) => {
          props.publicationStore.addGrantingOrganization(idx);
        }}
        onMergeParagraph={(idx) => {
          props.publicationStore.mergeGrantingOrganizationsParagraph(idx);
        }}
        onSplitParagraph={(idx, splitIndex) => {
          props.publicationStore.splitGrantingOrganizationsParagraph(
            idx,
            splitIndex
          );
        }}
        paragraphPrefixType={ParagraphPrefixType.BULLET}
        text={'Granting organizations'}
        placeholder={
          'Enter the names of the organizations that funded your research...'
        }
      />
    );
  }
);
