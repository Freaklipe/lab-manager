import type { FastifyInstance } from 'fastify';
import {
  getServersController,
  getServerByIdController,
  createServerController,
  patchServerController,
  deleteServerController,
} from '../controllers/server.controller.js';
import {
  createServerSchema,
  getServerByIdSchema,
  patchServerSchema,
} from '../schemas/server.schema.js';

export const serverRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.get('/servers', getServersController);

  server.get(
    '/servers/:id',
    {
      schema: getServerByIdSchema,
    },
    getServerByIdController,
  );

  server.post(
    '/servers',
    {
      schema: createServerSchema,
    },
    createServerController,
  );

  server.patch(
    '/servers/:id',
    {
      schema: patchServerSchema,
    },
    patchServerController,
  );

  server.delete(
    '/servers/:id',
    {
      schema: getServerByIdSchema,
    },
    deleteServerController,
  );
};
