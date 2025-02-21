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
import { FormControlLabel, Link, Radio, Typography } from "@mui/material"
import { DataCollectionType } from '../../apis/first-approval-api';
import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { publicationService } from '../../core/service'
import { Page, publicationPath } from '../../core/router/constants'
import { PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY } from './ActionBar'

const DATA_COLLECTION_TYPES = [{
  type: DataCollectionType.GENERAL,
  title: 'General First Approval collection',
  description: 'All types of datasets. No submission deadlines'
}, {
  type: DataCollectionType.AGING,
  title: 'Aging data collection',
  description: 'No submission deadlines. Peer reviewed datasets in the fields of aging research'
}, {
  type: DataCollectionType.STUDENT,
  title: 'Student data competition',
  description: 'Datasets generated by students. Submission deadline: 15 May 2025'
}];

interface ChooseDataCollectionPageProps {
  dataCollectionType: DataCollectionType
}
export const ChooseDataCollectionPage: FunctionComponent<ChooseDataCollectionPageProps> =
  observer((props: ChooseDataCollectionPageProps) => {
    const [dataCollectionType, setDataCollectionType] = useState(
      props.dataCollectionType ?? DataCollectionType.GENERAL
    );

    useEffect(() => {
      sessionStorage.removeItem(PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY);
    }, []);

    const createPublication = () => {
      publicationService
        .createPublication({ dataCollectionType })
        .then((response) =>
          routerStore.navigatePage(
            Page.PUBLICATION,
            `${publicationPath}/${response.data.id}`
          )
        );
    };

    type DataOptionProps = {
      type: string;
      title: string;
      description: string;
      isChecked: boolean;
      onChange: () => void;
    };

    const DataOption: React.FC<DataOptionProps> = ({ type, title, description, isChecked, onChange }) => (
      <OptionFormControlLabel
        value={type}
        label={
          <FlexWrapColumn style={{ marginLeft: '10px' }}>
            <FlexWrapRow style={{ alignItems: 'center' }}>
              <Typography variant={'h6'}>{title}</Typography>
              <Link href={'https://docs.google.com/document/d/1Cq5OTm_gODN3JUjZCBzid2eY_kmKn9AwVhDc1klmva0/edit?tab=t.0'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}>
                <InfoOutlined htmlColor={C04003661} sx={{ width: 24, height: 24, marginLeft: '12px', cursor: 'pointer' }} />
              </Link>
            </FlexWrapRow>
            <OptionDescription variant={'body2'}>{description}</OptionDescription>
          </FlexWrapColumn>
        }
        control={<Radio checked={isChecked} onChange={onChange} />}
      />
    );

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
                  onClick={() => routerStore.goHome()}
                  style={{
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                  htmlColor={C68676E}
                />
              </TitleRowWrap>
              <DataCollectionTypeWrap>
                {DATA_COLLECTION_TYPES.map(({ type, title, description }) => (
                  <DataOption
                    key={type}
                    type={type}
                    title={title}
                    description={description}
                    isChecked={dataCollectionType === type}
                    onChange={() => setDataCollectionType(type)}
                  />
                ))}
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
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background-color: #f8f7fa;
  padding: 24px;
  display: grid;
  gap: 16px;
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
  margin-right: 0;
  padding: 16px 16px 16px 10px;
`;
