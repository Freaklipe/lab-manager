import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;

const { host, port, database, user, password } = config.database;

const pool = new Pool({
  host,
  port,
  database,
  user,
  password,
});

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query('SELECT 1');
};

export default pool;
