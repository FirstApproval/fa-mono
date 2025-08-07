import React from "react"
import AvatarNameBox from "../elements/AvatarNameBox"
import { HeightElement } from "../../common.styled"
import { Typography } from "@mui/material"

export const Message = ({
  name,
  username,
  avatar,
  children
}: {
  name: string;
  username?: string,
  avatar: string;
  children: React.ReactNode | React.ReactNode[];
}): React.ReactElement => {
  return (
    <div>
      <AvatarNameBox avatar={avatar} name={name} username={username} />
      <HeightElement value={"12px"} />
      <Typography variant={"body"} style={{ whiteSpace: "pre-line" }}>
        {children}
      </Typography>
    </div>
  )
}
