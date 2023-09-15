ALTER TABLE publications
    ALTER COLUMN files_count DROP NOT NULL;

ALTER TABLE publications
    ALTER COLUMN folders_count DROP NOT NULL;
