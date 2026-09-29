const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const serverPort = Number(process.env.SERVER_PORT ?? 3000);

if (!Number.isInteger(serverPort) || serverPort <= 0 || serverPort > 65535) {
  throw new Error('SERVER_PORT must be a valid port number');
}

const postgresPort = Number(process.env.POSTGRES_PORT ?? 5432);

if (!Number.isInteger(postgresPort) || postgresPort <= 0 || postgresPort > 65535) {
  throw new Error('POSTGRES_PORT must be a valid port number');
}

export const config = {
  server: {
    host: process.env.SERVER_HOST ?? 'localhost',
    port: serverPort,
  },

  api: {
    prefix: process.env.API_PREFIX ?? '/api',
  },

  database: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: postgresPort,
    database: getRequiredEnv('POSTGRES_DB'),
    user: getRequiredEnv('POSTGRES_USER'),
    password: getRequiredEnv('POSTGRES_PASSWORD'),
  },

  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW ?? '1 minute',
  },
} as const;
