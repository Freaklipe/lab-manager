import type { FastifyInstance } from 'fastify';
import {
  getDeploymentsController,
  getDeploymentByIdController,
  createDeploymentController,
  patchDeploymentController,
  deleteDeploymentController,
} from '../controllers/deployment.controller.js';
import {
  createDeploymentSchema,
  getDeploymentByIdSchema,
  patchDeploymentSchema,
} from '../schemas/deployment.schema.js';

export const deploymentRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.get('/deployments', getDeploymentsController);

  server.get(
    '/deployments/:id',
    {
      schema: getDeploymentByIdSchema,
    },
    getDeploymentByIdController,
  );

  server.post(
    '/deployments',
    {
      schema: createDeploymentSchema,
    },
    createDeploymentController,
  );

  server.patch(
    '/deployments/:id',
    {
      schema: patchDeploymentSchema,
    },
    patchDeploymentController,
  );

  server.delete(
    '/deployments/:id',
    {
      schema: getDeploymentByIdSchema,
    },
    deleteDeploymentController,
  );
};
