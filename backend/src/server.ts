import Fastify from 'fastify';
import { config } from './config/env.js';
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

const { host, port } = config.server;
const { prefix } = config.api;

await server.register(healthRoutes, {
  prefix,
});

await server.register(labRoutes, {
  prefix,
});

await server.register(serverRoutes, {
  prefix,
});

await server.register(serviceRoutes, {
  prefix,
});

await server.register(projectRoutes, {
  prefix,
});

await server.register(deploymentRoutes, {
  prefix,
});

const start = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    server.log.info('PostgreSQL connection successful');

    await server.listen({
      port,
      host,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
