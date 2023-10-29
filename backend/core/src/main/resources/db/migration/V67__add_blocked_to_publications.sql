ALTER TABLE publications
    ADD COLUMN is_blocked BOOLEAN DEFAULT false;
ALTER TABLE publications
    ALTER COLUMN is_blocked DROP DEFAULT;
