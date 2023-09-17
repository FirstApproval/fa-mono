DROP TABLE users_organizations;
DROP TABLE users_organizations_departments;
ALTER TABLE users
    DROP COLUMN organization_id,
    DROP COLUMN organization_department_id;

CREATE TABLE users_workplaces
(
    id                         UUID PRIMARY KEY,
    organization_id            BIGINT    NOT NULL REFERENCES organizations (id),
    organization_department_id BIGINT REFERENCES organizations_departments (id),
    user_id                    UUID      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    is_former                  BOOLEAN   NOT NULL,
    address                    TEXT,
    postal_code                TEXT,
    creation_time              TIMESTAMP NOT NULL,
    editing_time               TIMESTAMP NOT NULL,
    UNIQUE (user_id, organization_id, organization_department_id)
);

CREATE UNIQUE INDEX users_workplaces_unique_idx ON users_workplaces (user_id)
    WHERE is_former = false;

CREATE SEQUENCE organizations_seq INCREMENT 50;
CREATE SEQUENCE organizations_departments_seq INCREMENT 50;

CREATE TABLE publication_unconfirmed_authors_workplaces
(
    id                         UUID PRIMARY KEY,
    organization_id            BIGINT    NOT NULL REFERENCES organizations (id),
    organization_department_id BIGINT REFERENCES organizations_departments (id),
    unconfirmed_author_id      UUID      NOT NULL REFERENCES publication_unconfirmed_authors (id) ON DELETE CASCADE,
    is_former                  BOOLEAN   NOT NULL,
    address                    TEXT,
    postal_code                TEXT,
    creation_time              TIMESTAMP NOT NULL,
    editing_time               TIMESTAMP NOT NULL,
    UNIQUE (unconfirmed_author_id, organization_id, organization_department_id)
);

CREATE UNIQUE INDEX publication_unconfirmed_authors_workplaces_idx ON users_workplaces (user_id)
    WHERE is_former = false;
