import { observer } from 'mobx-react-lite';
import { EditorProps } from './types';
import React, { ReactElement } from 'react';
import { ParagraphPrefixType } from './element/ListElement';
import { PrimaryArticleData } from './PrimaryArticleData';

import { OrderedListContentEditor } from './ListContentEditor';

export const RelatedPublicationsEditor = observer(
  (props: EditorProps): ReactElement => {
    return (
      <>
        <OrderedListContentEditor
          isReadonly={props.publicationStore.isReadonly}
          value={props.publicationStore.relatedArticles}
          onChange={(idx, value) => {
            props.publicationStore.updateRelatedArticle(idx, value);
          }}
          onAddParagraph={(idx) => {
            props.publicationStore.addRelatedArticle(idx);
          }}
          onMergeParagraph={(idx) => {
            props.publicationStore.mergeRelatedArticlesParagraph(idx);
          }}
          onSplitParagraph={(idx, splitIndex) => {
            props.publicationStore.splitRelatedArticlesParagraph(
              idx,
              splitIndex
            );
          }}
          paragraphPrefixType={ParagraphPrefixType.NUMERATION}
          text={'Related publications'}
          placeholder={
            'Provide references of the articles that are closely related to your research'
          }
          disableInitFocus={props.publicationStore.disableAutofocus}
        />
        {/* <div style={{ marginBottom: 48 }}> */}
        {/*  <PrimaryArticleData */}
        {/*    isReadOnly={props.publicationStore.isReadonly} */}
        {/*    onChange={(value) => { */}
        {/*      props.publicationStore.updatePrimaryArticle(value); */}
        {/*    }} */}
        {/*    value={props.publicationStore.primaryArticles}></PrimaryArticleData> */}
        {/* </div> */}
      </>
    );
  }
);
