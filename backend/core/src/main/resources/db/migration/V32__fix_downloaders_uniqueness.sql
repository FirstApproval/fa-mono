ALTER TABLE downloaders
    DROP CONSTRAINT IF EXISTS downloaders_publication_id_key;
ALTER TABLE downloaders
    ADD UNIQUE (publication_id, user_id);
CREATE INDEX idx_downloaders__publication_id ON downloaders (publication_id);
