CREATE TABLE ipfs_restore_requests
(
    id              UUID PRIMARY KEY,
    publication_id  TEXT      NOT NULL REFERENCES publications,
    user_id         UUID      NOT NULL REFERENCES users,
    content_id      BIGINT    NOT NULL,
    creation_time   TIMESTAMP NOT NULL,
    completion_time TIMESTAMP
);

CREATE UNIQUE INDEX ipfs_restore_requests_unique_idx
    ON ipfs_restore_requests (publication_id) WHERE completion_time IS NULL;

CREATE TABLE ipfs_histories
(
    id            UUID PRIMARY KEY,
    query_type    TEXT      NOT NULL,
    params        JSONB     NOT NULL,
    creation_time TIMESTAMP NOT NULL
)
