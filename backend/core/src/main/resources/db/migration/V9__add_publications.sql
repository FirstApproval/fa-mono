CREATE TABLE unconfirmed_users
(
    id        UUID PRIMARY KEY,
    email     TEXT UNIQUE,
    full_name TEXT NOT NULL,
    short_bio TEXT
);

CREATE TABLE publication_unconfirmed_authors
(
    publication_id UUID NOT NULL REFERENCES publications (id),
    user_id        UUID NOT NULL REFERENCES unconfirmed_users (id),
    PRIMARY KEY (publication_id, user_id)
);

CREATE TABLE publication_confirmed_authors
(
    publication_id UUID NOT NULL REFERENCES publications (id),
    user_id        UUID NOT NULL REFERENCES users (id),
    PRIMARY KEY (publication_id, user_id)
);

ALTER TABLE publications
RENAME COLUMN author_id TO creator_id;

ALTER TABLE publications
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN grant_organizations TEXT[],
ADD COLUMN related_articles TEXT[],
ADD COLUMN tags TEXT[],
ADD COLUMN object_of_study_title TEXT,
ADD COLUMN object_of_study_description TEXT,
ADD COLUMN software TEXT,
ADD COLUMN method_title TEXT,
ADD COLUMN method_description TEXT,
ADD COLUMN predicted_goals TEXT;



