import { spawn } from 'node:child_process';
import { Client } from 'pg';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const TEST_DATABASE = POSTGRES_DB;

if (!TEST_DATABASE) {
  console.error('Missing required environment variable: POSTGRES_DB');
  process.exit(1);
}

const adminClient = new Client({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: 'postgres',
});

try {
  await adminClient.connect();

  const result = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [TEST_DATABASE],
  );

  if (result.rowCount === 0) {
    console.log(`Creating test database: ${TEST_DATABASE}`);

    await adminClient.query(`CREATE DATABASE "${TEST_DATABASE}"`);

    console.log(`Test database created: ${TEST_DATABASE}`);
  } else {
    console.log(`Test database already exists: ${TEST_DATABASE}`);
  }
} catch (error) {
  console.error('Failed to prepare test database:', error);
  process.exit(1);
} finally {
  await adminClient.end();
}

const migrate = spawn(
  process.execPath,
  ['--env-file=../.env.test', 'scripts/migrate.js', 'up'],
  {
    stdio: 'inherit',
  },
);

migrate.on('exit', (code) => {
  process.exit(code ?? 1);
});
