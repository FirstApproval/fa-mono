import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { type PublicationStore } from './store/PublicationStore';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { getAuthorLink } from '../../core/router/utils';

export const Authors = observer(
  (props: { publicationStore: PublicationStore }): ReactElement => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          color: '#68676E',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '150%',
          letterSpacing: '0.15px'
        }}>
        <span style={{ marginRight: '6px' }}>Authored by</span>
        {props.publicationStore.authorNames
          // .sort((author1, author2) => author1.ordinal! - author2.ordinal!)
          .map((author, index) =>
            author.username ? (
              <div
                key={author.username}
                style={{ marginRight: '4px' }}
                onClick={() => {
                  routerStore.navigatePage(
                    Page.PROFILE,
                    getAuthorLink(author.username)
                  );
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
