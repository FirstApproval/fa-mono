CREATE TABLE external_ids
(
    external_id TEXT NOT NULL,
    type        TEXT NOT NULL,
    user_id     UUID NOT NULL REFERENCES users (id),
    PRIMARY KEY (external_id, type)
);

INSERT INTO external_ids (external_id, type, user_id)
SELECT facebook_id, 'FACEBOOK', id FROM users WHERE facebook_id IS NOT NULL
UNION ALL
SELECT google_id, 'GOOGLE', id FROM users WHERE google_id IS NOT NULL
UNION ALL
SELECT linkedin_id, 'LINKEDIN', id FROM users WHERE linkedin_id IS NOT NULL
UNION ALL
SELECT orcid_id, 'ORCID', id FROM users WHERE orcid_id IS NOT NULL;

ALTER TABLE users
    DROP COLUMN IF EXISTS facebook_id,
    DROP COLUMN IF EXISTS google_id,
    DROP COLUMN IF EXISTS linkedin_id,
    DROP COLUMN IF EXISTS orcid_id;
