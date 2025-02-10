ALTER TABLE publications
    ADD COLUMN is_replication_of_previous_experiments   BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN replication_of_previous_experiments_data TEXT,
    ADD COLUMN is_previously_published_dataset          BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN previously_published_dataset_data        TEXT;
