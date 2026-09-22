import Fastify from 'fastify';
import { healthRoutes } from './routes/health.routes.js';
import { checkDatabaseConnection } from './database/connection.js';

const server = Fastify({
  logger: true,
});

const SERVER_PORT = Number(process.env.SERVER_PORT ?? 3000);
const SERVER_HOST = process.env.SERVER_HOST ?? 'localhost';
const API_PREFIX = process.env.API_PREFIX ?? '/api';

await server.register(healthRoutes, {
  prefix: API_PREFIX,
});

const start = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    server.log.info('PostgreSQL connection successful');

    await server.listen({
      port: SERVER_PORT,
      host: SERVER_HOST,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
