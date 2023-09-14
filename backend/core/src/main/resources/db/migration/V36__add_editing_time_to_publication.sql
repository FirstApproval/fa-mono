ALTER TABLE publications
    ADD COLUMN editing_time TIMESTAMP;
UPDATE publications SET editing_time = creation_time WHERE true;
ALTER TABLE publications
    ALTER COLUMN editing_time SET NOT NULL;
