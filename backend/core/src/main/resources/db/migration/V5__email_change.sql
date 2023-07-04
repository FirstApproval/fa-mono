CREATE TABLE email_change_confirmations
(
    id            UUID PRIMARY KEY,
    user_id       UUID      NOT NULL REFERENCES users UNIQUE,
    email         TEXT      NOT NULL,
    code          TEXT      NOT NULL,
    creation_time TIMESTAMP NOT NULL
);
