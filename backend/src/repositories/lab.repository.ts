import pool from '../database/connection.js';

export interface Lab {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLabData {
  name: string;
  description?: string;
}

export interface UpdateLabData {
  name?: string;
  description?: string;
}

// Get ALL
export const findAllLabs = async (): Promise<Lab[]> => {
  const result = await pool.query<Lab>(
    `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM labs
      ORDER BY id;
    `,
  );

  return result.rows;
};

// Create One
export const createLab = async (
  data: CreateLabData,
): Promise<Lab> => {
  const result = await pool.query<Lab>(
    `
      INSERT INTO labs (
        name,
        description
      )
      VALUES ($1, $2)
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at;
    `,
    [data.name, data.description ?? null],
  );

  const lab = result.rows[0];

  if (!lab) {
    throw new Error('Failed to create lab');
  }

  return lab;
};

// Get one
export const findLabById = async (
  id: number,
): Promise<Lab | null> => {
  const result = await pool.query<Lab>(
    `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM labs
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

// PATCH
export const updateLab = async (
  id: number,
  data: UpdateLabData,
): Promise<Lab | null> => {
  const result = await pool.query<Lab>(
    `
      UPDATE labs
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        updated_at = NOW()
      WHERE id = $3
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at;
    `,
    [
      data.name ?? null,
      data.description ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

// DELETE
export const deleteLab = async (
  id: number,
): Promise<boolean> => {
  const result = await pool.query(
    `
      DELETE FROM labs
      WHERE id = $1;
    `,
    [id],
  );

  return result.rowCount === 1;
};
