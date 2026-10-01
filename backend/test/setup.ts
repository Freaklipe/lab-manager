import pool from '../src/database/connection.js';

export const cleanDatabase = async (): Promise<void> => {
  await pool.query(`
    TRUNCATE TABLE
      deployments,
      services,
      servers,
      projects,
      labs
    RESTART IDENTITY
    CASCADE;
  `);
};
