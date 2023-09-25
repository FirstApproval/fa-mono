UPDATE publications SET license_type = 'ATTRIBUTION_NO_DERIVATIVES' WHERE license_type IS NULL;
ALTER TABLE publications ALTER COLUMN license_type SET NOT NULL;
