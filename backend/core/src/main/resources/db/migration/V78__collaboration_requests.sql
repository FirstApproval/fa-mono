CREATE TABLE collaboration_requests
(
    id               UUID PRIMARY KEY,
    publication_id   TEXT REFERENCES publications (id) NOT NULL,
    user_id          UUID REFERENCES users (id)        NOT NULL,
    status           TEXT                              NOT NULL,
    creation_time    TIMESTAMP                         NOT NULL,
    isFinished       BOOLEAN NOT NULL DEFAULT FALSE,
    decision_time    TIMESTAMP,
    auto_approval    BOOLEAN,
    description      TEXT,
    first_name_legal TEXT,
    last_name_legal  TEXT,
    type_of_work     TEXT,
    author_response  TEXT
);

CREATE INDEX idx_collaboration_requests__publication_id ON collaboration_requests (publication_id);
CREATE INDEX idx_collaboration_requests__user_id ON collaboration_requests (user_id);

ALTER TABLE publications
    ADD COLUMN collaborators_count BIGINT NOT NULL DEFAULT 0;
