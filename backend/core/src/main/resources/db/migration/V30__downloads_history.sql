CREATE TABLE downloaders
(
    id             UUID PRIMARY KEY,
    publication_id UUID NOT NULL UNIQUE REFERENCES publications (id),
    user_id        UUID NOT NULL REFERENCES users (id),
    history        TEXT NOT NULL
)
