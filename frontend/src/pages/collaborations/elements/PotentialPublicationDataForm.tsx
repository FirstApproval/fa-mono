import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { Box, Button, FormControl, InputLabel, Select, TextField } from "@mui/material"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { UserAction } from "../chat/action/UserAction"
import { FlexWrapRowFullWidth } from "../../../components/WorkplacesEditor"
import { WidthElement } from "../../common.styled"
import MenuItem from "@mui/material/MenuItem"
import { CollaborationRequestTypeOfWork } from "../../../apis/first-approval-api"

export const PotentialPublicationDataForm = observer((
  props: { store: DownloadedPublicationCollaborationChatStore, action: UserAction }
): ReactElement => {
  const { store, action } = props

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
          value={store.potentialPublicationName}
        />
        <FormControl fullWidth>
          <InputLabel id="Type of your publication in collaboration">Type of your publication in collaboration</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={store.typeOfWork}
            label="Type of your publication in collaboration"
            onChange={() => {}}
          >
            <MenuItem value={CollaborationRequestTypeOfWork.ARTICLE}>Journal Article</MenuItem>
            <MenuItem value={CollaborationRequestTypeOfWork.DATASET}>Dataset</MenuItem>
            <MenuItem value={CollaborationRequestTypeOfWork.OTHER_PUBLICATION}>Other publication</MenuItem>
          </Select>
        </FormControl>
        <FlexWrapRowFullWidth>
          <TextField
            label="Expeted publication date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            style={{width: '35%'}}
            value={store.expectedPublicationDate}
          />
          <WidthElement value={'15px'} />
          <TextField
            fullWidth
            label="Intended journal for publication"
            variant="outlined"
            style={{width: '65%'}}
            value={store.intendedJournalForPublication}
          />
        </FlexWrapRowFullWidth>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Details of the research"
          variant="outlined"
          value={store.detailsOfResearch}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            onClick={() => action.action(store)}
            variant="outlined"
            style={{
              color: "#3b4eff",
              borderColor: "#3b4eff"
            }}>
            Done. What's next?
          </Button>
          <Button variant="text" style={{color: 'black'}}>Back</Button>
        </Box>
      </Box>
    </>
  )
})
