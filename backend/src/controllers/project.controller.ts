import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewProject,
  getProjects,
  getProjectById,
  updateExistingProject,
  deleteExistingProject,
} from '../services/project.service.js';

interface CreateProjectRequest {
  lab_id: number;
  name: string;
  description?: string;
  repository_url?: string;
}

interface GetProjectParams {
  id: string;
}

interface PatchProjectRequest {
  name?: string;
  description?: string;
  repository_url?: string;
}

export const createProjectController = async (
  request: FastifyRequest<{
    Body: CreateProjectRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const project = await createNewProject(request.body);

  await reply.code(201).send(project);
};

export const getProjectsController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const projects = await getProjects();

  await reply.send(projects);
};

export const getProjectByIdController = async (
  request: FastifyRequest<{
    Params: GetProjectParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const project = await getProjectById(id);

  if (!project) {
    await reply.code(404).send({
      error: 'Project not found',
    });

    return;
  }

  await reply.send(project);
};

export const patchProjectController = async (
  request: FastifyRequest<{
    Params: GetProjectParams;
    Body: PatchProjectRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const project = await updateExistingProject(id, request.body);

  if (!project) {
    await reply.code(404).send({
      error: 'Project not found',
    });

    return;
  }

  await reply.send(project);
};

export const deleteProjectController = async (
  request: FastifyRequest<{
    Params: GetProjectParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const deleted = await deleteExistingProject(id);

  if (!deleted) {
    await reply.code(404).send({
      error: 'Project not found',
    });

    return;
  }

  await reply.code(204).send();
};
