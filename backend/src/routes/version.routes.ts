import type { FastifyInstance } from 'fastify';
import { versionController } from '../controllers/version.controller.js';

export const versionRoutes = async (server: FastifyInstance): Promise<void> => {
  server.get('/version', versionController);
};
