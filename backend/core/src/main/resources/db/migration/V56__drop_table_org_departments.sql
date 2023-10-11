ALTER TABLE users_workplaces
    DROP COLUMN organization_department_id,
    ADD COLUMN organization_department TEXT;
ALTER TABLE publication_authors_workplaces
    DROP COLUMN organization_department_id,
    ADD COLUMN organization_department TEXT;
DROP TABLE organizations_departments;
