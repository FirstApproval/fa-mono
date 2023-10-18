ALTER TABLE publications
    ADD COLUMN character_count BIGINT NOT NULL DEFAULT 0;

ALTER TABLE publications
    ALTER COLUMN character_count DROP DEFAULT;
