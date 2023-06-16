CREATE TABLE users
(
    id            UUID PRIMARY KEY,
    first_name     TEXT,
    middle_name   TEXT,
    last_name     TEXT,
    full_name     TEXT,
    facebook_id   TEXT UNIQUE,
    google_id     TEXT UNIQUE,
    email         TEXT UNIQUE,
    username         TEXT UNIQUE,
    creation_time TIMESTAMP NOT NULL
);
