ALTER TABLE publications
    ADD COLUMN data_collection_type TEXT NOT NULL DEFAULT 'GENERAL';

ALTER TABLE publications ALTER data_collection_type DROP DEFAULT;
