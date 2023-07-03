CREATE TABLE publications
(
    id            UUID PRIMARY KEY,
    user_id       UUID      NOT NULL REFERENCES users,
    creation_time TIMESTAMP NOT NULL
);

CREATE TABLE publication_files
(
    id             UUID PRIMARY KEY,
    publication_id UUID      NOT NULL REFERENCES publications,
    full_path      TEXT      NOT NULL,
    dir_path       TEXT      NOT NULL,
    is_dir         BOOLEAN   NOT NULL,
    creation_time  TIMESTAMP NOT NULL
);
