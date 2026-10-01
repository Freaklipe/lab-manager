import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import { config } from './config/env.js';
import { loggerConfig } from './config/logger.js';

import { errorHandler } from './errors/error.handler.js';
import { healthRoutes } from './routes/health.routes.js';
import { labRoutes } from './routes/lab.routes.js';
import { serverRoutes } from './routes/server.routes.js';
import { serviceRoutes } from './routes/service.routes.js';
import { projectRoutes } from './routes/project.routes.js';
import { deploymentRoutes } from './routes/deployment.routes.js';

const { max, timeWindow } = config.rateLimit;
const { prefix } = config.api;

const server = Fastify({
  logger: loggerConfig,
  ajv: {
    customOptions: {
      removeAdditional: false,
    },
  },
});

await server.register(helmet);

await server.register(cors, {
  origin: config.cors.origin,
});

await server.register(rateLimit, {
  max,
  timeWindow,
});

server.setErrorHandler(errorHandler);

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

export { server };
