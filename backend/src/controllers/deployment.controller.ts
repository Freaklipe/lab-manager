import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewDeployment,
  getDeployments,
  getDeploymentById,
  updateExistingDeployment,
  deleteExistingDeployment,
} from '../services/deployment.service.js';

interface CreateDeploymentRequest {
  project_id: number;
  version: string;
  environment: string;
  status: string;
  deployed_at?: string;
}

interface GetDeploymentParams {
  id: string;
}

interface PatchDeploymentRequest {
  version?: string;
  environment?: string;
  status?: string;
  deployed_at?: string;
}

export const createDeploymentController = async (
  request: FastifyRequest<{
    Body: CreateDeploymentRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const data = {
    project_id: request.body.project_id,
    version: request.body.version,
    environment: request.body.environment,
    status: request.body.status,
    ...(request.body.deployed_at
      ? { deployed_at: new Date(request.body.deployed_at) }
      : {}),
  };

  const deployment = await createNewDeployment(data);

  await reply.code(201).send(deployment);
};

export const getDeploymentsController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const deployments = await getDeployments();

  await reply.send(deployments);
};

export const getDeploymentByIdController = async (
  request: FastifyRequest<{
    Params: GetDeploymentParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const deployment = await getDeploymentById(id);

  if (!deployment) {
    await reply.code(404).send({
      error: 'Deployment not found',
    });

    return;
  }

  await reply.send(deployment);
};

export const patchDeploymentController = async (
  request: FastifyRequest<{
    Params: GetDeploymentParams;
    Body: PatchDeploymentRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const data = {
    ...(request.body.version !== undefined
      ? { version: request.body.version }
      : {}),
    ...(request.body.environment !== undefined
      ? { environment: request.body.environment }
      : {}),
    ...(request.body.status !== undefined
      ? { status: request.body.status }
      : {}),
    ...(request.body.deployed_at !== undefined
      ? { deployed_at: new Date(request.body.deployed_at) }
      : {}),
  };

  const deployment = await updateExistingDeployment(id, data);

  if (!deployment) {
    await reply.code(404).send({
      error: 'Deployment not found',
    });

    return;
  }

  await reply.send(deployment);
};

export const deleteDeploymentController = async (
  request: FastifyRequest<{
    Params: GetDeploymentParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const deleted = await deleteExistingDeployment(id);

  if (!deleted) {
    await reply.code(404).send({
      error: 'Deployment not found',
    });

    return;
  }

  await reply.code(204).send();
};
