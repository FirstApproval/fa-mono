ALTER TABLE publications
    ADD COLUMN files_count   BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN folders_count BIGINT NOT NULL DEFAULT 0;

ALTER TABLE publications
    ALTER COLUMN files_count DROP DEFAULT;

ALTER TABLE publications
    ALTER COLUMN folders_count DROP DEFAULT;
