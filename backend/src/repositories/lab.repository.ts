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

// Select
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

// Register
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
