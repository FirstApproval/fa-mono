ALTER TABLE publication_files
    ADD COLUMN hash TEXT;

ALTER TABLE publication_sample_files
    ADD COLUMN hash TEXT;
