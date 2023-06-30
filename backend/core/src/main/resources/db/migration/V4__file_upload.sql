CREATE TABLE publications
(
    id UUID PRIMARY KEY
);

CREATE TABLE publication_files
(
    id             UUID PRIMARY KEY,
    publication_id UUID NOT NULL REFERENCES publications UNIQUE,
    name           TEXT NOT NULL,
    full_path      TEXT NOT NULL UNIQUE,
    dir_path       TEXT NOT NULL
);
