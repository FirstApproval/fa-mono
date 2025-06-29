CREATE TYPE MessageRecipientType AS ENUM (
    'COLLABORATION_REQUEST_CREATOR',
    'PUBLICATION_CREATOR'
    );

CREATE TABLE collaboration_request_messages_recipients
(
    message_id     UUID                 NOT NULL REFERENCES collaboration_request_messages (id) ON DELETE CASCADE,
    recipient_type MessageRecipientType NOT NULL,
    PRIMARY KEY (message_id, recipient_type)
);
