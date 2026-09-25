import type { FastifyInstance } from 'fastify';
import {
  getServicesController,
  getServiceByIdController,
  createServiceController,
  patchServiceController,
  deleteServiceController,
} from '../controllers/service.controller.js';
import {
  createServiceSchema,
  getServiceByIdSchema,
  patchServiceSchema,
} from '../schemas/service.schema.js';

export const serviceRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.get('/services', getServicesController);

  server.get(
    '/services/:id',
    {
      schema: getServiceByIdSchema,
    },
    getServiceByIdController,
  );

  server.post(
    '/services',
    {
      schema: createServiceSchema,
    },
    createServiceController,
  );

  server.patch(
    '/services/:id',
    {
      schema: patchServiceSchema,
    },
    patchServiceController,
  );

  server.delete(
    '/services/:id',
    {
      schema: getServiceByIdSchema,
    },
    deleteServiceController,
  );
};
