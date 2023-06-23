CREATE TABLE jobs
(
    id              BIGINT PRIMARY KEY,
    publication_id  UUID      NOT NULL UNIQUE REFERENCES publications (id),
    status          TEXT      NOT NULL,
    kind            TEXT      NOT NULL,
    creation_time   TIMESTAMP NOT NULL,
    completion_time TIMESTAMP
);

CREATE TABLE download_links
(
    publication_id  UUID PRIMARY KEY UNIQUE REFERENCES publications (id),
    url             TEXT NOT NULL,
    expiration_time TIMESTAMP NOT NULL
);
