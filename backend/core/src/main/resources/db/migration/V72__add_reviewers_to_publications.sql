CREATE TABLE publications_reviewers
(
    id             UUID PRIMARY KEY,
    publication_id TEXT REFERENCES publications (id) NOT NULL,
    email          TEXT                              NOT NULL,
    first_name     TEXT                              NOT NULL,
    last_name      TEXT                              NOT NULL,
    creation_time  TIMESTAMP                         NOT NULL
);

ALTER TABLE publications ADD is_fair_peer_review BOOLEAN DEFAULT FALSE;
ALTER TABLE publications ALTER is_fair_peer_review DROP DEFAULT;
