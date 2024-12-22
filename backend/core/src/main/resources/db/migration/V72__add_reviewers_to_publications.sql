CREATE TABLE publications_reviewers
(
    id             UUID PRIMARY KEY,
    publication_id TEXT REFERENCES publications (id) NOT NULL,
    email          TEXT                              NOT NULL,
    first_name     TEXT                              NOT NULL,
    last_name      TEXT                              NOT NULL
);
