import { logger } from '../config/logger.js';
import {
  createDeployment,
  findAllDeployments,
  findDeploymentById,
  updateDeployment,
  deleteDeployment,
  type CreateDeploymentData,
  type Deployment,
  type UpdateDeploymentData,
} from '../repositories/deployment.repository.js';

export const getDeployments = async (): Promise<Deployment[]> => {
  return findAllDeployments();
};

export const createNewDeployment = async (
  data: CreateDeploymentData,
): Promise<Deployment> => {
  const deployment = await createDeployment(data);

  logger.info(
    {
      deploymentId: deployment.id,
      projectId: deployment.project_id,
    },
    'Deployment created',
  );

  return deployment;
};

export const getDeploymentById = async (
  id: number,
): Promise<Deployment | null> => {
  return findDeploymentById(id);
};

export const updateExistingDeployment = async (
  id: number,
  data: UpdateDeploymentData,
): Promise<Deployment | null> => {
  const deployment = await updateDeployment(id, data);

  if (deployment) {
    logger.info(
      {
        deploymentId: deployment.id,
      },
      'Deployment updated',
    );
  }

  return deployment;
};

export const deleteExistingDeployment = async (
  id: number,
): Promise<boolean> => {
  const deleted = await deleteDeployment(id);

  if (deleted) {
    logger.info(
      {
        deploymentId: id,
      },
      'Deployment deleted',
    );
  }

  return deleted;
};
