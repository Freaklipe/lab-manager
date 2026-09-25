-- Up Migration

CREATE TABLE services (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    server_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    port INTEGER,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_services_server
        FOREIGN KEY (server_id)
        REFERENCES servers(id)
        ON DELETE RESTRICT
);

-- Down Migration

DROP TABLE services;
