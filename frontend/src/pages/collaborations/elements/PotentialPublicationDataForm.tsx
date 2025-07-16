import React, { ReactElement } from "react"
import { observer } from "mobx-react-lite"
import { Box, Button, FormControl, InputLabel, Select, TextField } from "@mui/material"
import { DownloadedPublicationCollaborationChatStore } from "../../publication/store/DownloadedPublicationCollaborationChatStore"
import { UserAction } from "../chat/action/UserAction"
import { FlexWrapRowFullWidth } from "../../../components/WorkplacesEditor"
import { WidthElement } from "../../common.styled"
import MenuItem from "@mui/material/MenuItem"
import { CollaborationRequestTypeOfWork } from "../../../apis/first-approval-api"
import _ from "lodash"

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
          onChange={e => store.setPotentialPublicationName(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="type-of-your-publication-in-collaboration">Type of your publication in collaboration</InputLabel>

          <Select
            value={store.typeOfWork}
            label="Type of your publication in collaboration"
            onChange={e => store.setTypeOfWork(e.target.value as CollaborationRequestTypeOfWork)}>
            {Object.keys(CollaborationRequestTypeOfWork).map((key) => (
              <MenuItem key={key} value={key}>
                {_.capitalize(key.toLowerCase().replace('_', ' '))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FlexWrapRowFullWidth>
          <TextField
            label="Expected publication date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '35%', cursor: 'pointer' }}
            sx={{ input: { cursor: 'pointer' } }}
            value={store.expectedPublicationDate}
            onChange={e => {
              store.setExpectedPublicationDate(e.target.value);
            }}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
              style: {
                cursor: 'pointer'
              },
            }}
            onClick={e => {
              const input = e.currentTarget.querySelector('input');
              if (input) input.showPicker?.();
            }}
          />
          <WidthElement value={'15px'} />
          <TextField
            fullWidth
            label="Intended journal for publication"
            variant="outlined"
            style={{width: '65%'}}
            value={store.intendedJournalForPublication}
            onChange={e => store.setIntendedJournalForPublication(e.target.value)}
          />
        </FlexWrapRowFullWidth>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Details of the research"
          variant="outlined"
          value={store.detailsOfResearch}
          onChange={e => store.setDetailsOfResearch(e.target.value)}
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
