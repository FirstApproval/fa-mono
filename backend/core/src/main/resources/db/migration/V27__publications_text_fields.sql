ALTER TABLE publications
    DROP COLUMN description,
    DROP COLUMN grant_organizations,
    DROP COLUMN related_articles,
    DROP COLUMN tags,
    DROP COLUMN object_of_study_description,
    DROP COLUMN software,
    DROP COLUMN method_description,
    DROP COLUMN predicted_goals;

ALTER TABLE publications
    ADD COLUMN description                 TEXT,
    ADD COLUMN grant_organizations         TEXT,
    ADD COLUMN related_articles            TEXT,
    ADD COLUMN tags                        TEXT,
    ADD COLUMN object_of_study_description TEXT,
    ADD COLUMN software                    TEXT,
    ADD COLUMN method_description          TEXT,
    ADD COLUMN predicted_goals             TEXT
