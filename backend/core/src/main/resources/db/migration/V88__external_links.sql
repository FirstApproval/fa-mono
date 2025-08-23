CREATE TABLE link_mappings
(
    id              UUID PRIMARY KEY,
    alias           TEXT      NOT NULL,
    url             TEXT      NOT NULL,
    creation_time   TIMESTAMP NOT NULL,
    expiration_time TIMESTAMP NOT NULL
);
