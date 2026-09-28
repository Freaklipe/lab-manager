import { logger } from '../config/logger.js';
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
  const service = await createService(data);

  logger.info(
    {
      serviceId: service.id,
      serverId: service.server_id,
    },
    'Service created',
  );

  return service;
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
  const service = await updateService(id, data);

  if (service) {
    logger.info(
      {
        serviceId: service.id,
      },
      'Service updated',
    );
  }

  return service;
};

export const deleteExistingService = async (
  id: number,
): Promise<boolean> => {
  const deleted = await deleteService(id);

  if (deleted) {
    logger.info(
      {
        serviceId: id,
      },
      'Service deleted',
    );
  }

  return deleted;
};
