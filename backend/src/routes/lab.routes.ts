import type { FastifyInstance } from 'fastify';
import {
  getLabsController,
  getLabByIdController,
  createLabController,
  patchLabController
} from '../controllers/lab.controller.js';
import {
  createLabSchema,
  getLabByIdSchema,
  patchLabSchema
} from '../schemas/lab.schema.js'

export const labRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.get('/labs', getLabsController);
  server.get(
    '/labs/:id',
    {
      schema: getLabByIdSchema
    },
    getLabByIdController
  );
  server.post(
    '/labs',
    {
      schema: createLabSchema
    },
    createLabController
  );
  server.patch(
    '/labs/:id',
    {
      schema: patchLabSchema
    },
    patchLabController
  );
};
