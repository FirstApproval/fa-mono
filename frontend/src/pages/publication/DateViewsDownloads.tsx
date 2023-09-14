import React, { type ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import Moment from 'react-moment';
import views from './asset/views.svg';
import downloads from './asset/downloads.svg';
import { type PublicationStore } from './store/PublicationStore';

export const DateViewsDownloads = observer(
  (props: {
    publicationStore: PublicationStore;
    openDownloadersDialog: () => void;
  }): ReactElement => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '20px',
          letterSpacing: '0.17000000178813934px',
          color: '#68676E'
        }}>
        <Moment format={'D MMMM YYYY'}>
          {props.publicationStore.publicationTime}
        </Moment>
        <div
          style={{
            marginLeft: '24px',
            display: 'flex',
            alignItems: 'center'
          }}>
          <img src={views} width={20} height={20} />
          <div style={{ marginLeft: '4px' }}>
            {props.publicationStore.viewsCount}
          </div>
        </div>
        <div
          onClick={props.openDownloadersDialog}
          style={{
            marginLeft: '24px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
          <img src={downloads} width={20} height={20} />
          <div style={{ marginLeft: '4px' }}>
            {props.publicationStore.downloadsCount}
          </div>
        </div>
      </div>
    );
  }
);
