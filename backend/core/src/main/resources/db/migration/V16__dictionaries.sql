CREATE TABLE methods
(
    id   BIGINT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE objects_of_studies
(
    id   BIGINT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE research_areas
(
    id   BIGINT PRIMARY KEY,
    name TEXT NOT NULL
);
