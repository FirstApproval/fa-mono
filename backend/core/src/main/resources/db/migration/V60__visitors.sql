CREATE TABLE visitors
(
    id            UUID PRIMARY KEY,
    ip            TEXT      NOT NULL,
    utm_source    TEXT,
    creation_time TIMESTAMP NOT NULL
);
