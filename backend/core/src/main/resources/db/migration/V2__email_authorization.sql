ALTER TABLE users
    ADD COLUMN password TEXT;

CREATE TABLE email_registration_confirmations
(
    id            UUID PRIMARY KEY,
    email         TEXT      NOT NULL,
    first_name    TEXT,
    last_name     TEXT,
    password      TEXT      NOT NULL UNIQUE,
    code          TEXT      NOT NULL,
    attempt_count INT       NOT NULL,
    last_try_time TIMESTAMP,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE password_reset_confirmations
(
    id            UUID PRIMARY KEY,
    user_id       UUID      NOT NULL REFERENCES users UNIQUE,
    attempt_count INT       NOT NULL,
    last_try_time TIMESTAMP,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE authorization_limits
(
    id            UUID UNIQUE PRIMARY KEY,
    email         TEXT      NOT NULL,
    count         INT       NOT NULL DEFAULT 0,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE shedlock
(
    name       TEXT PRIMARY KEY,
    lock_until TIMESTAMP NULL,
    locked_at  TIMESTAMP NULL,
    locked_by  TEXT
);
