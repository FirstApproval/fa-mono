import './ContentEditable.css';
import React, { type ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { $getRoot, $insertNodes } from 'lexical';
import { LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import FloatingTextFormatToolbarPlugin from '../rich-text/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from '../rich-text/FloatingLinkEditorPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { sanitizer } from '../../../../util/sanitizer';
import { v4 as uuidv4 } from 'uuid';

interface SectionProps {
  paragraphToFocus: number;
  isReadonly?: boolean;
  idx: number;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const theme = {};

function onError(error: any): void {
  console.error(error);
}

export const Section = (props: SectionProps): ReactElement => {
  const { value } = props;

  const [id] = useState(() => uuidv4());

  const initialConfig = {
    namespace: id,
    nodes: [LinkNode],
    theme,
    onError
  };

  return (
    <SectionWrap>
      {!props.isReadonly && (
        <EditorWrap>
          <LexicalComposer initialConfig={initialConfig}>
            <Editor {...props}></Editor>
          </LexicalComposer>
        </EditorWrap>
      )}
      {props.isReadonly && (
        <Typography
          variant={'body'}
          component={'div'}
          dangerouslySetInnerHTML={{ __html: sanitizer(value) }}></Typography>
      )}
    </SectionWrap>
  );
};

const Editor = (props: SectionProps): ReactElement => {
  const { paragraphToFocus, idx, placeholder, onChange, value } = props;
  const [editor] = useLexicalComposerContext();

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (paragraphToFocus === idx) {
      editor.focus();
    }
  }, [paragraphToFocus, editor]);

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
  }, []);

  return (
    <>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className={'ContentEditable__root'} />
        }
        placeholder={<PlaceholderWrap>{placeholder}</PlaceholderWrap>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <OnChangePlugin
        onChange={(editorState, editor) => {
          editor.update(() => {
            const html = $generateHtmlFromNodes(editor);
            onChange(html);
          });
        }}
      />
      <FloatingTextFormatToolbarPlugin />
      <FloatingLinkEditorPlugin
        isLinkEditMode={isLinkEditMode}
        setIsLinkEditMode={setIsLinkEditMode}
      />
    </>
  );
};

const EditorWrap = styled.div`
  width: 100%;
  position: relative;
`;

const PlaceholderWrap = styled.div`
  color: #999;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 20px;
  left: 0px;
  user-select: none;
  display: inline-block;
  pointer-events: none;

  /* typography/body */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const SectionWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
`;
