import pool from '../database/connection.js';
import { mapPostgresError } from '../errors/pg-error.mapper.js';

export interface Project {
  id: number;
  lab_id: number;
  name: string;
  description: string | null;
  repository_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectData {
  lab_id: number;
  name: string;
  description?: string;
  repository_url?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  repository_url?: string;
}

export const findAllProjects = async (): Promise<Project[]> => {
  const result = await pool.query<Project>(
    `
      SELECT
        id,
        lab_id,
        name,
        description,
        repository_url,
        created_at,
        updated_at
      FROM projects
      ORDER BY id;
    `,
  );

  return result.rows;
};

export const createProject = async (
  data: CreateProjectData,
): Promise<Project> => {
  try {
    const result = await pool.query<Project>(
      `
        INSERT INTO projects (
          lab_id,
          name,
          description,
          repository_url
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          lab_id,
          name,
          description,
          repository_url,
          created_at,
          updated_at;
      `,
      [
        data.lab_id,
        data.name,
        data.description ?? null,
        data.repository_url ?? null,
      ],
    );

    const project = result.rows[0];

    if (!project) {
      throw new Error('Failed to create project');
    }

    return project;
  } catch (error) {
    throw mapPostgresError(error);
  }
};

export const findProjectById = async (
  id: number,
): Promise<Project | null> => {
  const result = await pool.query<Project>(
    `
      SELECT
        id,
        lab_id,
        name,
        description,
        repository_url,
        created_at,
        updated_at
      FROM projects
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateProject = async (
  id: number,
  data: UpdateProjectData,
): Promise<Project | null> => {
  const result = await pool.query<Project>(
    `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        repository_url = COALESCE($3, repository_url),
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id,
        lab_id,
        name,
        description,
        repository_url,
        created_at,
        updated_at;
    `,
    [
      data.name ?? null,
      data.description ?? null,
      data.repository_url ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteProject = async (
  id: number,
): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
        DELETE FROM projects
        WHERE id = $1;
      `,
      [id],
    );

    return result.rowCount === 1;
  } catch (error) {
    throw mapPostgresError(error);
  }
};
