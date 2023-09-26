ALTER TABLE organizations
    ADD COLUMN moderated BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE organizations
    ALTER COLUMN moderated DROP DEFAULT;
