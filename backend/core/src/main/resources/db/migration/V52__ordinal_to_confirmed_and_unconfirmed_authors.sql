ALTER TABLE publication_confirmed_authors
    ADD COLUMN ordinal SMALLINT DEFAULT 0;
ALTER TABLE publication_unconfirmed_authors
    ADD COLUMN ordinal SMALLINT DEFAULT 0;
ALTER TABLE publication_confirmed_authors
    ALTER COLUMN ordinal DROP DEFAULT;
ALTER TABLE publication_unconfirmed_authors
    ALTER COLUMN ordinal DROP DEFAULT;
