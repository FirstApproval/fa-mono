ALTER TABLE publications
    ADD COLUMN is_negative BOOLEAN DEFAULT false;
ALTER TABLE publications
    ADD COLUMN negative_data TEXT;
ALTER TABLE publications
    ALTER COLUMN is_negative DROP DEFAULT;

