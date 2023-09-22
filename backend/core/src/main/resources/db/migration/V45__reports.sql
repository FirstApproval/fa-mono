CREATE TABLE reports
(
    id            UUID PRIMARY KEY,
    email         TEXT      NOT NULL,
    description   TEXT      NOT NULL,
    file_ids      TEXT      NOT NULL,
    creation_time TIMESTAMP NOT NULL
)
