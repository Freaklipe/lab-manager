import pool from '../database/connection.js';
import { mapPostgresError } from '../errors/pg-error.mapper.js';

export interface Service {
  id: number;
  server_id: number;
  name: string;
  description: string | null;
  port: number | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateServiceData {
  server_id: number;
  name: string;
  description?: string;
  port?: number;
  status: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  port?: number;
  status?: string;
}

export const findAllServices = async (): Promise<Service[]> => {
  const result = await pool.query<Service>(
    `
      SELECT
        id,
        server_id,
        name,
        description,
        port,
        status,
        created_at,
        updated_at
      FROM services
      ORDER BY id;
    `,
  );

  return result.rows;
};

export const createService = async (
  data: CreateServiceData,
): Promise<Service> => {
  try {
    const result = await pool.query<Service>(
      `
        INSERT INTO services (
          server_id,
          name,
          description,
          port,
          status
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          server_id,
          name,
          description,
          port,
          status,
          created_at,
          updated_at;
      `,
      [
        data.server_id,
        data.name,
        data.description ?? null,
        data.port ?? null,
        data.status,
      ],
    );

    const service = result.rows[0];

    if (!service) {
      throw new Error('Failed to create service');
    }

    return service;
  } catch (error) {
    throw mapPostgresError(error);
  }
};

export const findServiceById = async (
  id: number,
): Promise<Service | null> => {
  const result = await pool.query<Service>(
    `
      SELECT
        id,
        server_id,
        name,
        description,
        port,
        status,
        created_at,
        updated_at
      FROM services
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateService = async (
  id: number,
  data: UpdateServiceData,
): Promise<Service | null> => {
  const result = await pool.query<Service>(
    `
      UPDATE services
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        port = COALESCE($3, port),
        status = COALESCE($4, status),
        updated_at = NOW()
      WHERE id = $5
      RETURNING
        id,
        server_id,
        name,
        description,
        port,
        status,
        created_at,
        updated_at;
    `,
    [
      data.name ?? null,
      data.description ?? null,
      data.port ?? null,
      data.status ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteService = async (
  id: number,
): Promise<boolean> => {
  const result = await pool.query(
    `
      DELETE FROM services
      WHERE id = $1;
    `,
    [id],
  );

  return result.rowCount === 1;
};
