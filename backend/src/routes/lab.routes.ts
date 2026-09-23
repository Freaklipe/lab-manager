import type { FastifyInstance } from 'fastify';
import {
  createLabController,
  getLabsController
} from '../controllers/lab.controller.js';
import { createLabSchema } from '../schemas/lab.schema.js'

export const labRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.post(
    '/labs',
    {
      schema: createLabSchema
    },
    createLabController
  );
  server.get('/labs', getLabsController);
};
