import { FlexWrapColumn, HeightElement } from "../common.styled"
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { collaborationsPageStore } from "../publication/store/downloadsStore"
import { observer } from "mobx-react-lite"
import { ReactElement } from "react"
import styled from '@emotion/styled';
import { PublicationShortInfo } from "../../apis/first-approval-api"
import { TextSizeTruncation } from "../../util/stylesUtil"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { CollaborationsPageStore } from "../publication/store/CollaborationsPageStore"

export const LeftPanelPublicationsPage = observer((): ReactElement => {
  return (
    <LeftPanel>
      <FlexWrapColumn>
        {collaborationsPageStore.myPublications &&
          mapPublications(
            collaborationsPageStore.myPublications,
            'My datasets'
          )}
        <HeightElement value={'10px'} />
        {collaborationsPageStore.downloadedPublications &&
          mapPublications(
            collaborationsPageStore.downloadedPublications,
            'Downloaded datasets'
          )}
      </FlexWrapColumn>
    </LeftPanel>
  );
});

function mapPublications(publications: PublicationShortInfo[], header: string) {
  return (<>
    <LeftPanelHeader variant={'h6'}>{header}</LeftPanelHeader>
    <List sx={{ width: '100%' }}>
      {publications?.map(
        (publicationInfo) => mapToListItem(publicationInfo, collaborationsPageStore)
      )}
    </List>
  </>);
}

function mapToListItem(publicationInfo: PublicationShortInfo, collaborationsPageStore: CollaborationsPageStore) {
  return (
    <ListItemButton
      sx={{
        width: '100%',
        borderRadius: '8px'
      }}
      onClick={() => collaborationsPageStore.selectPublication(publicationInfo)}>
      <ListItemText
        primary={TextSizeTruncation(
          publicationInfo.title!!,
          26
        )}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      />
      <ListItemIcon
        sx={{
          minWidth: 'auto',
          marginLeft: 'auto'
        }}>
        <FiberManualRecordIcon
          sx={{
            fontSize: 18,
            color: 'primary.main'
          }}
        />
      </ListItemIcon>
    </ListItemButton>
  );
}

const LeftPanel = styled.div`
  flex: 22%;
  display: flex;
  max-width: 300px;
  flex-direction: column;
  align-items: start;
  border-right: 1px solid #d2d2d6;

  justify-content: space-between;
  padding: 22px;
`;

const LeftPanelHeader = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-size: 0.8rem;
  padding-left: 16px;
`;
