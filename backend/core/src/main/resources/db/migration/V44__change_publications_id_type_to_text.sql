ALTER TABLE publication_confirmed_authors
    DROP CONSTRAINT IF EXISTS publication_confirmed_authors_publication_id_fkey;
ALTER TABLE publication_files
    DROP CONSTRAINT IF EXISTS publication_files_publication_id_fkey;
ALTER TABLE publication_sample_files
    DROP CONSTRAINT IF EXISTS publication_sample_files_publication_id_fkey;
ALTER TABLE download_links
    DROP CONSTRAINT IF EXISTS download_links_publication_id_fkey;
ALTER TABLE downloaders
    DROP CONSTRAINT IF EXISTS downloaders_publication_id_fkey;
ALTER TABLE jobs
    DROP CONSTRAINT IF EXISTS jobs_publication_id_fkey;

ALTER TABLE publication_confirmed_authors
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE publication_unconfirmed_authors
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE publication_files
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE publication_sample_files
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE download_links
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE downloaders
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE jobs
    ALTER COLUMN publication_id TYPE TEXT;
ALTER TABLE publications
    ALTER COLUMN id TYPE TEXT;

UPDATE publication_unconfirmed_authors
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE publication_confirmed_authors
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE publication_files
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE publication_sample_files
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE download_links
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE downloaders
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE jobs
SET publication_id = upper(substr(publication_id::text, 0, 8))
WHERE TRUE;
UPDATE publications
SET id = upper(substr(id::text, 0, 8))
WHERE TRUE;

ALTER TABLE publication_unconfirmed_authors
    ADD CONSTRAINT publication_unconfirmed_authors_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE publication_confirmed_authors
    ADD CONSTRAINT publication_confirmed_authors_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE publication_files
    ADD CONSTRAINT publication_files_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE publication_sample_files
    ADD CONSTRAINT publication_sample_files_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE download_links
    ADD CONSTRAINT download_links_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE downloaders
    ADD CONSTRAINT downloaders_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
ALTER TABLE jobs
    ADD CONSTRAINT jobs_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES publications (id);
