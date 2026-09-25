-- Up Migration

CREATE TABLE deployments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id BIGINT NOT NULL,
    version VARCHAR(100) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    deployed_at TIMESTAMPTZ,

    CONSTRAINT fk_deployments_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE RESTRICT
);

-- Down Migration

DROP TABLE deployments;
