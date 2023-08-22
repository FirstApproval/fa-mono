ALTER TABLE unconfirmed_users
    ADD publication_id UUID;

UPDATE unconfirmed_users
SET publication_id = (SELECT publication_id FROM publication_unconfirmed_authors WHERE user_id = unconfirmed_users.id);

DELETE FROM unconfirmed_users WHERE id NOT IN (SELECT user_id FROM publication_unconfirmed_authors);

ALTER TABLE unconfirmed_users
    ALTER publication_id SET NOT NULL;

DROP TABLE publication_unconfirmed_authors;
