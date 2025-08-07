import { FlexWrapColumn, HeightElement } from "../common.styled"
import { List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material"
import { collaborationsPageStore } from "../publication/store/downloadsStore"
import { observer } from "mobx-react-lite"
import { ReactElement } from "react"
import styled from '@emotion/styled';
import { PublicationShortInfo } from "../../apis/first-approval-api"
import { TextSizeTruncation } from "../../util/stylesUtil"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"

const TITLE_TRUNCATE_LENGTH = 25;

export const LeftPanelPublicationsPage = observer((): ReactElement => {
  return (
    <LeftPanel>
      <FlexWrapColumn>
        {mapPublications(
            'My datasets',
            true,
            collaborationsPageStore.myPublications,
          )}
        <HeightElement value="10px" />
        {collaborationsPageStore.downloadedPublications && (
          <>
            {mapPublications(
              'Downloaded • Open access',
              false,
              collaborationsPageStore.openAccessDownloadedPublications
            )}
            <HeightElement value="8px"/>
            {mapPublications(
              'Downloaded • FA License',
              false,
              collaborationsPageStore.collaborationRequirementsDownloadedPublications
            )}
          </>
        )}
      </FlexWrapColumn>
    </LeftPanel>
  );
});

function mapPublications(header: string, isMyPublication: boolean, publications?: PublicationShortInfo[]) {
  return publications?.length ? (<>
    <LeftPanelHeader variant={'h6'}>{header}</LeftPanelHeader>
    <List sx={{ width: '100%' }}>
      {publications?.map(
        (publicationInfo) => mapToListItem(publicationInfo, isMyPublication)
      )}
    </List>
  </>) : <></>;
}

function mapToListItem(publicationInfo: PublicationShortInfo, isMyPublication: boolean) {
  return (
    <ListItemButton
      sx={{
        width: '100%',
        borderRadius: '8px'
      }}
      onClick={() => {
        if (isMyPublication) {
          collaborationsPageStore.selectMyPublication(publicationInfo);
        } else {
          collaborationsPageStore.selectDownloadedPublication(publicationInfo);
        }
      }}>
      <Tooltip title={publicationInfo.title?.length!! > TITLE_TRUNCATE_LENGTH ? publicationInfo.title : undefined}>
        <ListItemText
          primary={TextSizeTruncation(publicationInfo.title!!, TITLE_TRUNCATE_LENGTH)}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        />
      </Tooltip>
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
