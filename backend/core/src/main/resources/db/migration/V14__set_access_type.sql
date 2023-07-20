UPDATE publications SET access_type = 'CLOSED' WHERE access_type IS NULL;
ALTER TABLE publications
    ALTER COLUMN access_type SET NOT NULL;
