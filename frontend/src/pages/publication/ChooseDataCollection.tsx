import React, { FunctionComponent, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import {
  FlexBodyCenter,
  FlexWrapColumn,
  FlexWrapRow,
  Header,
  HeightElement,
  Parent,
  TitleRowWrap
} from '../common.styled';
import { ArrowForward, Close, InfoOutlined } from '@mui/icons-material';
import { routerStore } from '../../core/router';
import { C04003661, C68676E } from '../../ui-kit/colors';
import { FormControlLabel, Radio, Typography } from '@mui/material';
import { DataCollectionType } from '../../apis/first-approval-api';
import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { publicationService } from "../../core/service"
import { Page, publicationPath } from "../../core/router/constants"

export const ChooseDataCollectionPage: FunctionComponent = observer(() => {
  const [dataCollectionType, setDataCollectionType] = useState(
    DataCollectionType.GENERAL
  );

  useEffect(() => {});

  const createPublication = () => {
    debugger;
    publicationService.createPublication({dataCollectionType}).then(response =>
      routerStore.navigatePage(Page.PUBLICATION, `${publicationPath}/${response.data.id}`)
    );
  }

  return (
    <>
      <Helmet>
        <meta name="description" content={'Choose Data Collection'} />
      </Helmet>
      <Parent>
        <FlexBodyCenter>
          <Body>
            <HeightElement value={'70px'} />
            <TitleRowWrap height={'130px'}>
              <Header style={{ alignSelf: 'flex-end' }}>
                Choose data collection
              </Header>
              <Close
                fontSize={'large'}
                onClick={() => routerStore.back()}
                style={{
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
                htmlColor={C68676E}
              />
            </TitleRowWrap>
            <DataCollectionTypeWrap>
              <OptionFormControlLabel
                value={DataCollectionType.GENERAL}
                label={
                  <FlexWrapColumn style={{ marginLeft: '10px' }}>
                    <FlexWrapRow style={{ alignItems: 'center' }}>
                      <Typography variant={'h6'}>
                        General First Approval collection
                      </Typography>
                      <InfoOutlined
                        htmlColor={C04003661}
                        sx={{
                          width: 24,
                          height: 24,
                          marginLeft: '12px'
                        }}
                      />
                    </FlexWrapRow>
                    <OptionDescription variant={'body2'}>
                      All types of datasets. No submission deadlines
                    </OptionDescription>
                  </FlexWrapColumn>
                }
                control={
                  <Radio
                    checked={dataCollectionType === DataCollectionType.GENERAL}
                    onChange={() =>
                      setDataCollectionType(DataCollectionType.GENERAL)
                    }
                  />
                }
              />
              <HeightElement value={'16px'} />
              <OptionFormControlLabel
                value={DataCollectionType.AGING}
                label={
                  <FlexWrapColumn style={{ marginLeft: '10px' }}>
                    <FlexWrapRow style={{ alignItems: 'center' }}>
                      <Typography variant={'h6'}>
                        Aging data collection
                      </Typography>
                      <InfoOutlined
                        htmlColor={C04003661}
                        sx={{
                          width: 24,
                          height: 24,
                          marginLeft: '12px'
                        }}
                      />
                    </FlexWrapRow>
                    <OptionDescription variant={'body2'}>
                      No submission deadlines. Peer reviewed datasets in the
                      fields of aging research
                    </OptionDescription>
                  </FlexWrapColumn>
                }
                control={
                  <Radio
                    checked={dataCollectionType === DataCollectionType.AGING}
                    onChange={() =>
                      setDataCollectionType(DataCollectionType.AGING)
                    }
                  />
                }
              />
              <HeightElement value={'16px'} />
              <OptionFormControlLabel
                value={DataCollectionType.STUDENT}
                label={
                  <FlexWrapColumn style={{ marginLeft: '10px' }}>
                    <FlexWrapRow style={{ alignItems: 'center' }}>
                      <Typography variant={'h6'}>
                        Student data competition
                      </Typography>
                      <InfoOutlined
                        htmlColor={C04003661}
                        sx={{
                          width: 24,
                          height: 24,
                          marginLeft: '12px'
                        }}
                      />
                    </FlexWrapRow>
                    <OptionDescription variant={'body2'}>
                      Datasets generated by students.
                    </OptionDescription>
                  </FlexWrapColumn>
                }
                control={
                  <Radio
                    checked={dataCollectionType === DataCollectionType.STUDENT}
                    onChange={() =>
                      setDataCollectionType(DataCollectionType.STUDENT)
                    }
                  />
                }
              />
            </DataCollectionTypeWrap>
            <HeightElement value="26px" />
            <LoadingButton
              disabled={!dataCollectionType}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={() => createPublication()}>
              Continue
            </LoadingButton>
          </Body>
        </FlexBodyCenter>
      </Parent>
    </>
  );
});

export const Body = styled.div`
  width: 688px;
`;

const DataCollectionTypeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background-color: #f8f7fa;
  padding: 24px;
`;

const OptionDescription = styled(Typography)`
  margin-top: 4px;
  color: #68676e;
`;

const OptionFormControlLabel = styled(FormControlLabel)`
  background-color: #ffffff;
  width: 100%;
  border-radius: 8px;
  margin-left: 0;
  padding: 16px 16px 16px 10px;
`;
