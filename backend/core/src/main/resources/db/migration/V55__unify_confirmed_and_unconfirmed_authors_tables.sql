ALTER TABLE publication_unconfirmed_authors
    RENAME TO publications_authors;
ALTER TABLE publications_authors
    ADD user_id      UUID REFERENCES users,
    ADD is_confirmed BOOLEAN DEFAULT false,
    DROP COLUMN short_bio,
    DROP COLUMN middle_name;

ALTER TABLE publications_authors
    ALTER COLUMN is_confirmed DROP DEFAULT;

INSERT INTO publications_authors (id,
                                  user_id,
                                  email,
                                  last_name,
                                  first_name,
                                  publication_id,
                                  ordinal,
                                  creation_time,
                                  is_confirmed)
SELECT pca.id,
       u.id,
       u.email,
       u.last_name,
       u.first_name,
       pca.publication_id,
       pca.ordinal,
       pca.creation_time,
       true
FROM publication_confirmed_authors pca
         INNER JOIN users u on pca.user_id = u.id;

ALTER TABLE publications_authors ADD CONSTRAINT check_user_id_presence
    CHECK (
            (is_confirmed = true AND user_id IS NOT NULL) OR
            (is_confirmed = false AND user_id IS NULL)
        );

DROP TABLE publication_confirmed_authors;

ALTER TABLE publication_unconfirmed_authors_workplaces RENAME TO publication_authors_workplaces;
ALTER TABLE publication_authors_workplaces RENAME COLUMN unconfirmed_author_id TO author_id;
