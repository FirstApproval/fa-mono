import { HeightElement } from "../../common.styled"
import { Box, Button, Link, TextField, Typography } from "@mui/material"
import React, { ReactElement } from "react"
import { WorkplacesEditor } from "../../../components/WorkplacesEditor"
import { IWorkplaceStore } from "../../../core/WorkplaceProps"
import { observer } from "mobx-react-lite"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"

export const PersonalData = observer((
  props: { handlePublicationFormMsg: () => void, store: DownloadedPublicationCollaborationChatStore}
): ReactElement => {
  const { handlePublicationFormMsg, store } = props;
  debugger;
  return (
    <>
      <HeightElement value={'2rem'} />
      <Box
        component="form"
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid #dedede',
          maxWidth: '600px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
        <Box sx={{
          display: 'flex',
          gap: 2
        }}>
          <TextField fullWidth
                     label="First name"
                     variant="outlined"
                     value={store.firstName}
                     onChange={(e) => {
                       store.setFirstName(e.currentTarget.value);
                     }}
          />
          <TextField fullWidth
                     label="Last name"
                     variant="outlined"
                     value={store.lastName}
                     onChange={(e) => {
                       store.setLastName(e.currentTarget.value);
                     }}
          />
        </Box>

        {store.workplaces && <WorkplacesEditor store={store} isModalWindow={false} /> }

        <Box sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Button onClick={handlePublicationFormMsg} variant="outlined">
            I confirm that provided info is real
          </Button>
          <Typography component={Link} href="#" variant="body2">
            Back
          </Typography>
        </Box>
      </Box>
    </>
  );
});
