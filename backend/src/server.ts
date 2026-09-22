import Fastify from 'fastify';
import { healthRoutes } from './routes/health.routes.js';

const server = Fastify({
  logger: true,
});

await server.register(healthRoutes, {
  prefix: '/api',
});

server.get('/health', async () => {
  return {
    status: 'ok',
  };
});

const start = async (): Promise<void> => {
  try {
    await server.listen({
      port: 3000,
      host: 'localhost',
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
