ALTER TABLE publications
    ADD COLUMN downloads_count BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN views_count BIGINT NOT NULL DEFAULT 0;
