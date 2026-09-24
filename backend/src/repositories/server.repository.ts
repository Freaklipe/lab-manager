import pool from '../database/connection.js';
import { mapPostgresError } from '../errors/pg-error.mapper.js';

export interface Server {
  id: number;
  lab_id: number;
  name: string;
  hostname: string | null;
  ip_address: string | null;
  operating_system: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateServerData {
  lab_id: number;
  name: string;
  hostname?: string;
  ip_address?: string;
  operating_system?: string;
  status: string;
}

export interface UpdateServerData {
  name?: string;
  hostname?: string;
  ip_address?: string;
  operating_system?: string;
  status?: string;
}

export const findAllServers = async (): Promise<Server[]> => {
  const result = await pool.query<Server>(
    `
      SELECT
        id,
        lab_id,
        name,
        hostname,
        ip_address,
        operating_system,
        status,
        created_at,
        updated_at
      FROM servers
      ORDER BY id;
    `,
  );

  return result.rows;
};

export const createServer = async (
  data: CreateServerData,
): Promise<Server> => {
  try {
    const result = await pool.query<Server>(
      `
        INSERT INTO servers (
          lab_id,
          name,
          hostname,
          ip_address,
          operating_system,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          lab_id,
          name,
          hostname,
          ip_address,
          operating_system,
          status,
          created_at,
          updated_at;
      `,
      [
        data.lab_id,
        data.name,
        data.hostname ?? null,
        data.ip_address ?? null,
        data.operating_system ?? null,
        data.status,
      ],
    );

    const server = result.rows[0];

    if (!server) {
      throw new Error('Failed to create server');
    }

    return server;
  } catch (error) {
    throw mapPostgresError(error);
  }
};

export const findServerById = async (
  id: number,
): Promise<Server | null> => {
  const result = await pool.query<Server>(
    `
      SELECT
        id,
        lab_id,
        name,
        hostname,
        ip_address,
        operating_system,
        status,
        created_at,
        updated_at
      FROM servers
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateServer = async (
  id: number,
  data: UpdateServerData,
): Promise<Server | null> => {
  const result = await pool.query<Server>(
    `
      UPDATE servers
      SET
        name = COALESCE($1, name),
        hostname = COALESCE($2, hostname),
        ip_address = COALESCE($3, ip_address),
        operating_system = COALESCE($4, operating_system),
        status = COALESCE($5, status),
        updated_at = NOW()
      WHERE id = $6
      RETURNING
        id,
        lab_id,
        name,
        hostname,
        ip_address,
        operating_system,
        status,
        created_at,
        updated_at;
    `,
    [
      data.name ?? null,
      data.hostname ?? null,
      data.ip_address ?? null,
      data.operating_system ?? null,
      data.status ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteServer = async (
  id: number,
): Promise<boolean> => {
  const result = await pool.query(
    `
      DELETE FROM servers
      WHERE id = $1;
    `,
    [id],
  );

  return result.rowCount === 1;
};
