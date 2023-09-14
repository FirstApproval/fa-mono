ALTER TABLE publications
    ADD COLUMN archive_size        BIGINT,
    ADD COLUMN archive_sample_size BIGINT;

ALTER TABLE publication_files
    ADD COLUMN size BIGINT;

ALTER TABLE publication_sample_files
    ADD COLUMN size BIGINT;
