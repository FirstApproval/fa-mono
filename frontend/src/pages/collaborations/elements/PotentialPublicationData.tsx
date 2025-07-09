import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { Box, Button, TextField } from "@mui/material"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"

export const PotentialPublicationData = observer((
  props: { store: DownloadedPublicationCollaborationChatStore }
): ReactElement => {
  const { store } = props

  return (
    <>
      <Box
        component="form"
        sx={{
          mx: 'auto',
          p: 3,
          borderRadius: 2,
          border: '1px solid #D2D2D6',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          marginTop: '10px'
        }}>
        <TextField
          fullWidth
          label="Potential title of your publication in collaboration"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Type of your publication in collaboration"
          variant="outlined"
          defaultValue="Journal Article"
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Details of the research"
          variant="outlined"
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined"   style={{
            color: '#3b4eff',
            borderColor: '#3b4eff'
          }}>
            Done. What's next?
          </Button>
          <Button variant="text" style={{color: 'black'}}>Back</Button>
        </Box>
      </Box>
    </>
  )
})
