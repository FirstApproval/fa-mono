CREATE TABLE academic_supervisor_letters
(
    id                       UUID PRIMARY KEY,
    publication_id           TEXT      NOT NULL REFERENCES publications (id) ON DELETE CASCADE,
    file_name                TEXT      NOT NULL,
    content_length           BIGINT    NOT NULL,
    academic_supervisor_name TEXT      NOT NULL,
    creation_time            TIMESTAMP NOT NULL
);
