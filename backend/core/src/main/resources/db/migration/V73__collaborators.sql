CREATE TABLE collaborators
(
    id             UUID PRIMARY KEY,
    publication_id TEXT REFERENCES publications (id) NOT NULL,
    user_id        UUID REFERENCES users (id)        NOT NULL,
    creation_time  TIMESTAMP                         NOT NULL
);

CREATE INDEX idx_collaborators__publication_id ON collaborators (publication_id);
CREATE INDEX idx_collaborators__user_id ON collaborators (user_id);

CREATE TABLE collaboration_requests
(
    id             UUID PRIMARY KEY,
    publication_id TEXT REFERENCES publications (id) NOT NULL,
    user_id        UUID REFERENCES users (id)        NOT NULL,
    creation_time  TIMESTAMP                         NOT NULL,
    approval_time  TIMESTAMP,
    rejection_time TIMESTAMP,
    auto_approval  BOOLEAN
);

CREATE INDEX idx_collaboration_requests__publication_id ON collaboration_requests (publication_id);
CREATE INDEX idx_collaboration_requests__user_id ON collaboration_requests (user_id);

ALTER TABLE publications
    ADD COLUMN collaborators_count BIGINT NOT NULL DEFAULT 0;
