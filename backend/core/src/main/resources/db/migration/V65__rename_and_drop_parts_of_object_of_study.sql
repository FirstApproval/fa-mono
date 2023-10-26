ALTER TABLE publications
    RENAME COLUMN object_of_study_description to data_description;
ALTER TABLE publications
    DROP COLUMN object_of_study_title;
