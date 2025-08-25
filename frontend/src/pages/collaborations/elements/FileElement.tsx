import { Link } from "@mui/material"
import React, { ReactElement } from "react"
import styled from "@emotion/styled"
import { observer } from "mobx-react-lite"
import { DescriptionOutlined } from "@mui/icons-material"

export const CollaborationMessageFile  = observer((
  props: { link: string, fileName: string }
): ReactElement => {
  return (
    <FileElement>
      <Link
        href={props.link}
        target={"_blank"}
        underline={"none"}
        sx={{ color: "black" }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: "pointer"
        }}
      >
        <DescriptionOutlined />
        <span>{props.fileName}</span>
      </Link>
    </FileElement>
  );
});

const FileElement = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  border-radius: 4px;
  background-color: #F3F2F5;
  padding: 8px 12px;
  cursor: pointer;
`;
