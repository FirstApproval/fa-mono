import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { type PublicationStore } from './store/PublicationStore';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';

export const Authors = observer(
  (props: { publicationStore: PublicationStore }): ReactElement => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          color: '#68676E',
          fontSize: '20px',
          fontWeight: '400',
          lineHeight: '32px',
          letterSpacing: '0.15000000596046448px'
        }}>
        <span style={{ marginRight: '6px' }}>Authored by</span>
        {props.publicationStore.authorNames.map((author, index) =>
          author.userName ? (
            <div
              key={author.userName}
              style={{ marginRight: '4px' }}
              onClick={() => {
                routerStore.navigatePage(Page.PROFILE, `/p/${author.userName}`);
              }}>
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}>
                {author.firstName} {author.lastName}
              </span>
              <span>
                {index < props.publicationStore.authorNames.length - 1
                  ? ' ,'
                  : ''}
              </span>
            </div>
          ) : (
            <div
              key={author.firstName + author.lastName}
              style={{ marginRight: '4px' }}>
              <span>
                {author.firstName} {author.lastName}
              </span>
              <span>
                {index < props.publicationStore.authorNames.length - 1
                  ? ' ,'
                  : ''}
              </span>
            </div>
          )
        )}
      </div>
    );
  }
);
