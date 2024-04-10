ALTER TABLE downloaders
    ADD COLUMN last_download_time TIMESTAMP;

UPDATE downloaders
SET last_download_time = (SELECT MAX(history_item ->> 'creationTime')::timestamp
                          FROM (SELECT jsonb_array_elements(history) AS history_item
                                FROM downloaders
                                WHERE id = :downloaderId) AS history_items);

ALTER TABLE downloaders
    ALTER COLUMN last_download_time SET NOT NULL;
