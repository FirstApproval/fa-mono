ALTER TABLE publications
    ADD COLUMN storage_type TEXT;
UPDATE publications set storage_type = 'CLOUD_SECURE_STORAGE' WHERE status = 'PUBLISHED';
