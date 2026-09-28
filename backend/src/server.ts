import Fastify from 'fastify';
import { loggerConfig } from './config/logger.js';
import { checkDatabaseConnection } from './database/connection.js';
import { errorHandler } from './errors/error.handler.js';
import { healthRoutes } from './routes/health.routes.js';
import { labRoutes } from './routes/lab.routes.js';
import { serverRoutes } from './routes/server.routes.js';
import { serviceRoutes } from './routes/service.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { deploymentRoutes } from './routes/deployment.routes.js';

const server = Fastify({
  logger: loggerConfig,
  ajv: {
    customOptions: {
      removeAdditional: false,
    },
  },
});

server.setErrorHandler(errorHandler);

const SERVER_PORT = Number(process.env.SERVER_PORT ?? 3000);
const SERVER_HOST = process.env.SERVER_HOST ?? 'localhost';
const API_PREFIX = process.env.API_PREFIX ?? '/api';

await server.register(healthRoutes, {
  prefix: API_PREFIX,
});

await server.register(labRoutes, {
  prefix: API_PREFIX,
});

await server.register(serverRoutes, {
  prefix: API_PREFIX,
});

await server.register(serviceRoutes, {
  prefix: API_PREFIX,
});

await server.register(projectRoutes, {
  prefix: API_PREFIX,
});

await server.register(deploymentRoutes, {
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
