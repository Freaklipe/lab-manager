import type { FastifyInstance } from 'fastify';
import {
  getProjectsController,
  getProjectByIdController,
  createProjectController,
  patchProjectController,
  deleteProjectController,
} from '../controllers/project.controller.js';
import {
  createProjectSchema,
  getProjectByIdSchema,
  patchProjectSchema,
} from '../schemas/project.schema.js';

export const projectRoutes = async (
  server: FastifyInstance,
): Promise<void> => {
  server.get('/projects', getProjectsController);

  server.get(
    '/projects/:id',
    {
      schema: getProjectByIdSchema,
    },
    getProjectByIdController,
  );

  server.post(
    '/projects',
    {
      schema: createProjectSchema,
    },
    createProjectController,
  );

  server.patch(
    '/projects/:id',
    {
      schema: patchProjectSchema,
    },
    patchProjectController,
  );

  server.delete(
    '/projects/:id',
    {
      schema: getProjectByIdSchema,
    },
    deleteProjectController,
  );
};
