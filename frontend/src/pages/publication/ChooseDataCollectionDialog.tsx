import React, { FunctionComponent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import { Header, Parent, TitleRowWrap } from "../common.styled"
import DialogTitle from "@mui/material/DialogTitle"
import { Close } from "@mui/icons-material"

export const ChooseDataCollectionDialog: FunctionComponent = observer(() => {
  useEffect(() => {
  });

  return     <>
    <Helmet>
      <meta
        name="description"
        content={'Сhoose Data Collection'}
      />
    </Helmet>
    <div>
      <Parent>
        <TitleRowWrap>
          <Header>
            Choose data collection
          </Header>
          <Close
            onClick={() => {}}
            style={{
              cursor: 'pointer',
              marginRight: '16px'
            }}
            htmlColor={'#68676E'}
          />
        </TitleRowWrap>
      </Parent>
    </div>
  </>;
});
