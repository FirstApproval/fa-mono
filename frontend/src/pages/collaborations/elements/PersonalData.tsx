import { HeightElement } from "../../common.styled"
import { Box, Button, Link, TextField, Typography } from "@mui/material"
import React, { ReactElement } from "react"
import { WorkplacesEditor } from "../../../components/WorkplacesEditor"
import { observer } from "mobx-react-lite"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { UserAction } from "../chat/action/UserAction"

export const PersonalData = observer((
  props: { action: UserAction, store: DownloadedPublicationCollaborationChatStore}
): ReactElement => {
  const { action, store } = props;
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
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
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

        {store.workplaces && <WorkplacesEditor store={store} isModalWindow={true} /> }

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Button
            onClick={() => action.action(store)}
            variant="outlined"
            style={{
              color: '#3b4eff',
              borderColor: '#3b4eff'
            }}
          >
            {action.text}
          </Button>
          <Typography component={Link} href="#" variant="body2">
            Cancel
          </Typography>
        </Box>
      </Box>
    </>
  );
});
