ALTER TABLE publication_confirmed_authors
    ADD COLUMN short_bio TEXT;

ALTER TABLE publication_confirmed_authors
    ADD COLUMN id UUID DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE publication_confirmed_authors DROP CONSTRAINT publication_confirmed_authors_pkey;
ALTER TABLE publication_confirmed_authors ADD PRIMARY KEY (id);
ALTER TABLE publication_confirmed_authors ALTER COLUMN ID DROP DEFAULT;
CREATE UNIQUE INDEX publication_confirmed_authors_unique_idx ON publication_confirmed_authors(publication_id, user_id);
