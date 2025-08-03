import { Link } from "@mui/material"
import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { observer } from "mobx-react-lite"
import { DescriptionOutlined } from "@mui/icons-material"

export const CollaborationMessageFile  = observer((
  props: { link: string }
): ReactElement => {
  return <FileElement>
    <Link
      href={props.link}
      target={"_blank"}
      underline={"none"}
      sx={{ color: "black" }}
      style={{ cursor: "pointer" }}
    >
      <DescriptionOutlined />
      FA Collaboration Agreement template.pdf
    </Link>
  </FileElement>
});

const FileElement = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: 48px;
  border-radius: 4px;
  background-color: #F3F2F5;
  padding: 8px 12px;
  margin-top: 12px;
  cursor: pointer;
`;
