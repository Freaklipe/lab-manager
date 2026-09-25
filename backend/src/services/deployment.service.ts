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
  return createDeployment(data);
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
  return updateDeployment(id, data);
};

export const deleteExistingDeployment = async (
  id: number,
): Promise<boolean> => {
  return deleteDeployment(id);
};
