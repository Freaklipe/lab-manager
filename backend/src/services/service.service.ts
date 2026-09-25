import {
  createService,
  findAllServices,
  findServiceById,
  updateService,
  deleteService,
  type CreateServiceData,
  type Service,
  type UpdateServiceData,
} from '../repositories/service.repository.js';

export const getServices = async (): Promise<Service[]> => {
  return findAllServices();
};

export const createNewService = async (
  data: CreateServiceData,
): Promise<Service> => {
  return createService(data);
};

export const getServiceById = async (
  id: number,
): Promise<Service | null> => {
  return findServiceById(id);
};

export const updateExistingService = async (
  id: number,
  data: UpdateServiceData,
): Promise<Service | null> => {
  return updateService(id, data);
};

export const deleteExistingService = async (
  id: number,
): Promise<boolean> => {
  return deleteService(id);
};
