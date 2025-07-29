import React from "react";
import { CollaborationRequestMessage } from "../../../apis/first-approval-api"
import { createMessageRenderers } from "./messageRenderers"
import { CollaborationChatStoreInterface } from "../../publication/store/MyPublicationCollaborationChatStore"

interface Props {
  message: CollaborationRequestMessage;
  chatStore: CollaborationChatStoreInterface;
}

export const MessageContent: React.FC<Props> = ({ message, chatStore }) => {
  const renderers = createMessageRenderers(chatStore);
  const renderer = renderers[message.type as keyof typeof renderers];

  return <>{renderer ? renderer(message) : null}</>;
};
