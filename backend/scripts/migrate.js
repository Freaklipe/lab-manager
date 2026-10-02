import { spawn } from 'node:child_process';

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const requiredVariables = {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
};

for (const [name, value] of Object.entries(requiredVariables)) {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

const databaseUrl = [
  'postgres://',
  encodeURIComponent(POSTGRES_USER),
  ':',
  encodeURIComponent(POSTGRES_PASSWORD),
  '@',
  encodeURIComponent(POSTGRES_HOST),
  ':',
  POSTGRES_PORT,
  '/',
  encodeURIComponent(POSTGRES_DB),
].join('');

const args = process.argv.slice(2);

const migrate = spawn(
  process.execPath,
  [
    'node_modules/node-pg-migrate/bin/node-pg-migrate.js',
    ...args,
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  },
);

migrate.on('exit', (code) => {
  process.exit(code ?? 1);
});
