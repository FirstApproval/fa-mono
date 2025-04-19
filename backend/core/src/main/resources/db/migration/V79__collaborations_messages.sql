-- messages
CREATE TABLE collaboration_request_messages
(
    id                       UUID PRIMARY KEY,
    collaboration_request_id UUID      NOT NULL UNIQUE REFERENCES collaboration_requests (id) ON DELETE CASCADE,
    is_finished              BOOLEAN DEFAULT FALSE,
    user_id                  UUID REFERENCES users (id),
    type                     TEXT      NOT NULL,
    text                     TEXT,
    payload                  JSONB,
    sequence_index           INT       NOT NULL,
    creation_time            TIMESTAMP NOT NULL
);

CREATE TABLE collaboration_request_message_files
(
    id         UUID PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES collaboration_request_messages (id) ON DELETE CASCADE,
    file_id    TEXT NOT NULL
);
