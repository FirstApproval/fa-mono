ALTER TABLE users
    ADD COLUMN tsv TSVECTOR;

CREATE TRIGGER users_tsvector_trigger
    BEFORE INSERT OR UPDATE OF last_name, first_name, middle_name, full_name, email
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE tsvector_update_trigger(tsv, 'pg_catalog.simple', last_name, first_name, middle_name, full_name, email)
