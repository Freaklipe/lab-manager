-- Up Migration

CREATE TABLE servers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lab_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    hostname VARCHAR(255),
    ip_address VARCHAR(45),
    operating_system VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_servers_lab
        FOREIGN KEY (lab_id)
        REFERENCES labs(id)
        ON DELETE RESTRICT
);

-- Down Migration

DROP TABLE servers;
