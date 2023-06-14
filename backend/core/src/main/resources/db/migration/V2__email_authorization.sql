ALTER TABLE users
    ADD COLUMN password TEXT;

CREATE TABLE email_registration_confirmations
(
    id            UUID PRIMARY KEY,
    email         TEXT      NOT NULL,
    password      TEXT      NOT NULL,
    code          TEXT      NOT NULL,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE password_reset_confirmations
(
    id      UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE shedlock
(
    name       TEXT PRIMARY KEY,
    lock_until TIMESTAMP NULL,
    locked_at  TIMESTAMP NULL,
    locked_by  TEXT
)
