import pool from '../database/connection.js';
import { mapPostgresError } from '../errors/pg-error.mapper.js';

export interface Deployment {
  id: number;
  project_id: number;
  version: string;
  environment: string;
  status: string;
  deployed_at: Date | null;
}

export interface CreateDeploymentData {
  project_id: number;
  version: string;
  environment: string;
  status: string;
  deployed_at?: Date;
}

export interface UpdateDeploymentData {
  version?: string;
  environment?: string;
  status?: string;
  deployed_at?: Date;
}

export const findAllDeployments = async (): Promise<Deployment[]> => {
  const result = await pool.query<Deployment>(
    `
      SELECT
        id,
        project_id,
        version,
        environment,
        status,
        deployed_at
      FROM deployments
      ORDER BY id;
    `,
  );

  return result.rows;
};

export const createDeployment = async (
  data: CreateDeploymentData,
): Promise<Deployment> => {
  try {
    const result = await pool.query<Deployment>(
      `
        INSERT INTO deployments (
          project_id,
          version,
          environment,
          status,
          deployed_at
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          project_id,
          version,
          environment,
          status,
          deployed_at;
      `,
      [
        data.project_id,
        data.version,
        data.environment,
        data.status,
        data.deployed_at ?? null,
      ],
    );

    const deployment = result.rows[0];

    if (!deployment) {
      throw new Error('Failed to create deployment');
    }

    return deployment;
  } catch (error) {
    throw mapPostgresError(error);
  }
};

export const findDeploymentById = async (
  id: number,
): Promise<Deployment | null> => {
  const result = await pool.query<Deployment>(
    `
      SELECT
        id,
        project_id,
        version,
        environment,
        status,
        deployed_at
      FROM deployments
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateDeployment = async (
  id: number,
  data: UpdateDeploymentData,
): Promise<Deployment | null> => {
  const result = await pool.query<Deployment>(
    `
      UPDATE deployments
      SET
        version = COALESCE($1, version),
        environment = COALESCE($2, environment),
        status = COALESCE($3, status),
        deployed_at = COALESCE($4, deployed_at)
      WHERE id = $5
      RETURNING
        id,
        project_id,
        version,
        environment,
        status,
        deployed_at;
    `,
    [
      data.version ?? null,
      data.environment ?? null,
      data.status ?? null,
      data.deployed_at ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteDeployment = async (
  id: number,
): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
        DELETE FROM deployments
        WHERE id = $1;
      `,
      [id],
    );

    return result.rowCount === 1;
  } catch (error) {
    throw mapPostgresError(error);
  }
};
