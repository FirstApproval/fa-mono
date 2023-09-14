CREATE EXTENSION pg_trgm;
CREATE EXTENSION btree_gin;

CREATE TABLE organizations
(
    id            BIGINT PRIMARY KEY,
    name          TEXT UNIQUE,
    creation_time TIMESTAMP NOT NULL
);

CREATE INDEX idx_gin_organizations
    ON organizations
        USING gin (name);

CREATE TABLE organizations_departments
(
    id              BIGINT PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations (id) ON DELETE CASCADE,
    name            TEXT,
    creation_time   TIMESTAMP NOT NULL,
    UNIQUE (organization_id, name)
);

CREATE INDEX idx_gin_organizations_departments
    ON organizations_departments
        USING gin (name);

CREATE TABLE users_organizations
(
    organization_id BIGINT NOT NULL REFERENCES organizations (id),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE users_organizations_departments
(
    organization_department_id BIGINT NOT NULL REFERENCES organizations_departments (id),
    user_id                    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (organization_department_id, user_id)
);

ALTER TABLE users
    ADD COLUMN organization_id            BIGINT REFERENCES organizations (id),
    ADD COLUMN organization_department_id BIGINT REFERENCES organizations_departments (id);
