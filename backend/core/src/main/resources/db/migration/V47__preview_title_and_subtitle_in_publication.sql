ALTER TABLE publications
    ADD COLUMN preview_title TEXT,
    ADD COLUMN preview_subtitle TEXT;

UPDATE publications SET preview_title = substr(title, 0, 100) WHERE TRUE;
UPDATE publications SET preview_subtitle = substr(description, 0, 200) WHERE TRUE;
