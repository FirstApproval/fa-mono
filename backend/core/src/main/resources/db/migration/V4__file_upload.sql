CREATE TABLE publications
(
    id UUID PRIMARY KEY
);

CREATE TABLE publication_files
(
    id             UUID PRIMARY KEY,
    publication_id UUID NOT NULL REFERENCES publications,
    name           TEXT NOT NULL,
    full_path      TEXT NOT NULL,
    dir_path       TEXT NOT NULL,
    is_dir         BOOLEAN NOT NULL
);
