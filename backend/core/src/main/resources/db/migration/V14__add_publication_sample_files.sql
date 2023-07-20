CREATE TABLE publication_sample_files
(
    id             UUID PRIMARY KEY,
    publication_id UUID      NOT NULL REFERENCES publications,
    full_path      TEXT      NOT NULL,
    description    TEXT,
    dir_path       TEXT      NOT NULL,
    is_dir         BOOLEAN   NOT NULL,
    creation_time  TIMESTAMP NOT NULL
);
