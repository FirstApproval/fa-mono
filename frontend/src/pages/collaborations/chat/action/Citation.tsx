import { CollaborationMessageType, DataCollectionType } from "../../../../apis/first-approval-api"
import { DATA_COLLECTION_TYPES } from "../../../publication/ChooseDataCollection"
import React from "react"
import { CollaborationChatStore } from "../../../publication/store/CollaborationChatStore"

import { UserAction } from "./UserAction"

function citationAction(collaborationChatStore: CollaborationChatStore): void {
  // список всех авторов в формате [Фамилия Инициалы], дальше идет точка, за которой с большой буквы - [Название датасета].
  // Год. First Approval [если специализированная коллекция - ее название] (например First Approval - Aging Data Collection)

  const publication = collaborationChatStore.publication!!

  const mappedAuthors = publication.authors!!
    .map(author => `${author.lastName} ${author.firstName.charAt(0)}`)
    .join(", ")

  const year = publication.creationTime.substring(0, 4)

  const dataCollectionTypeTitle = publication.dataCollectionType === DataCollectionType.GENERAL ? "" :
    (" - " + DATA_COLLECTION_TYPES
        .find(dataCollectionType => dataCollectionType.type === publication.dataCollectionType)!!
        .title
    )

  console.log(<p>
    {mappedAuthors}. {publication.title}. {year}.{" "}
    First Approval{dataCollectionTypeTitle}.
  </p>)

  const message = `${mappedAuthors}. ${publication.title}. ${year}. First Approval${dataCollectionTypeTitle}.`

  collaborationChatStore.sendMessage({
    isAssistant: true,
    type: CollaborationMessageType.NONE,
    text: message
  }, CollaborationMessageType.NONE)
}

export const citation: UserAction = {
  text: 'Citation',
  action: (collaborationChatStore: CollaborationChatStore) => citationAction(collaborationChatStore),
};
