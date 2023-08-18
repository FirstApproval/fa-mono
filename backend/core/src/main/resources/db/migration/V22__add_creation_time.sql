ALTER TABLE download_links
    ADD COLUMN creation_time TIMESTAMP NOT NULL DEFAULT now();

ALTER TABLE publication_confirmed_authors
    ADD COLUMN creation_time TIMESTAMP NOT NULL DEFAULT now();

ALTER TABLE publication_unconfirmed_authors
    ADD COLUMN creation_time TIMESTAMP NOT NULL DEFAULT now();

ALTER TABLE unconfirmed_users
    ADD COLUMN creation_time TIMESTAMP NOT NULL DEFAULT now();
