ALTER TABLE downloaders
    RENAME COLUMN history TO old_history;
ALTER TABLE downloaders
    ADD COLUMN history JSONB;

UPDATE downloaders
SET history = (SELECT jsonb_agg(jsonb_build_object(
    'creationTime', to_timestamp(value::numeric)::timestamp || 'Z',
    'agreeToTheFirstApprovalLicense', false
    ))
               FROM unnest(string_to_array(REPLACE(REPLACE(old_history, '[', ''), ']', ''), ',')) AS value);
