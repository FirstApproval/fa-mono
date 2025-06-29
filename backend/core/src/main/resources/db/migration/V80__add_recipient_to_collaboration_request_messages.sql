CREATE TABLE collaboration_request_messages_recipients
(
    message_id     UUID NOT NULL REFERENCES collaboration_request_messages (id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL,
    PRIMARY KEY (message_id, recipient_type)
);
