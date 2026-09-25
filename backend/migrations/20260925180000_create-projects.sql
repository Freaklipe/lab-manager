-- Up Migration

CREATE TABLE projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lab_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_projects_lab
        FOREIGN KEY (lab_id)
        REFERENCES labs(id)
        ON DELETE RESTRICT
);

-- Down Migration

DROP TABLE projects;
