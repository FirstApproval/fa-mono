CREATE TABLE users
(
    id            UUID PRIMARY KEY,
    orcid_id      TEXT,
    google_id     TEXT,
    email         TEXT,
    creation_time TIMESTAMP NOT NULL
);
