import React from "react"
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { AcademicLevel } from "../../../apis/first-approval-api"
import { LabelWrap } from "../editors/styled"
import { observer } from "mobx-react-lite"
import { PublicationStore } from "../store/PublicationStore"

export interface AcademicLevelElementProps {
  publicationStore: PublicationStore
}

interface AcademicLeveOption {
  value: AcademicLevel,
  label: string,
}

const options: AcademicLeveOption [] = [
  {
    value: AcademicLevel.UNDERGRADUATE_STUDENT,
    label: 'Undergraduate student (or Bachelor student)'
  },
  {
    value: AcademicLevel.GRADUATE_STUDENT,
    label: 'Graduate student (or Master student)'
  },
  {
    value: AcademicLevel.PHD_STUDENT,
    label: 'PhD student'
  },
];


export const AcademicLevelElement = observer((props: AcademicLevelElementProps) => {
  return (
    <FormControl component="fieldset" style={{ marginBottom: '30px' }}>
      <LabelWrap>{'Select Academic Level'}</LabelWrap>
      <RadioGroup value={props.publicationStore.academicLevel}
                  onChange={(e) => {
                    props.publicationStore.updateAcademicLevel(e.target.value as AcademicLevel)}}
      >
        {Object.values(options).map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
});
