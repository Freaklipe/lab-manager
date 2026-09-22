import type { FastifyInstance } from 'fastify';
import { healthController } from '../controllers/health.controller.js';

export const healthRoutes = async (server: FastifyInstance): Promise<void> => {
  server.get('/health', healthController);
};
