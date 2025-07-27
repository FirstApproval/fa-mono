import { AuthorShortInfo, UserInfo } from "../../apis/first-approval-api"
import { Link } from "@mui/material"
import { profilePath } from "../../core/router/constants"
import { getFullName } from "../../util/userUtil"
import React from "react"

export const mapAuthorWithLink = (author: AuthorShortInfo | UserInfo) => {
  const fullName = getFullName(author);
  return author.username ?
    <Link href={`${profilePath}${author.username}`}
          target="_blank"
          sx={{
            textDecoration: "underline",
            textDecorationColor: "black",
            textDecorationThickness: "1.5px",
            textUnderlineOffset: "2px",
            color: "black"
          }}
    >
      {fullName}
    </Link> :
    <span>{fullName}</span>
}
