CREATE TABLE collaboration_requests_invited_authors
(
    id                       UUID PRIMARY KEY,
    collaboration_request_id UUID NOT NULL REFERENCES collaboration_requests (id) ON DELETE CASCADE,
    author_id                UUID NOT NULL REFERENCES publications_authors (id) ON DELETE CASCADE,
    status                   TEXT NOT NULL,
    creation_time            TIMESTAMP NOT NULL,
    editing_time             TIMESTAMP NOT NULL,
    UNIQUE (collaboration_request_id, author_id)
);
