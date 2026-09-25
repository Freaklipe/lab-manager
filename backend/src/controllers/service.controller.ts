import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewService,
  getServices,
  getServiceById,
  updateExistingService,
  deleteExistingService,
} from '../services/service.service.js';

interface CreateServiceRequest {
  server_id: number;
  name: string;
  description?: string;
  port?: number;
  status: string;
}

interface GetServiceParams {
  id: string;
}

interface PatchServiceRequest {
  name?: string;
  description?: string;
  port?: number;
  status?: string;
}

export const createServiceController = async (
  request: FastifyRequest<{
    Body: CreateServiceRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const service = await createNewService(request.body);

  await reply.code(201).send(service);
};

export const getServicesController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const services = await getServices();

  await reply.send(services);
};

export const getServiceByIdController = async (
  request: FastifyRequest<{
    Params: GetServiceParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const service = await getServiceById(id);

  if (!service) {
    await reply.code(404).send({
      error: 'Service not found',
    });

    return;
  }

  await reply.send(service);
};

export const patchServiceController = async (
  request: FastifyRequest<{
    Params: GetServiceParams;
    Body: PatchServiceRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const service = await updateExistingService(id, request.body);

  if (!service) {
    await reply.code(404).send({
      error: 'Service not found',
    });

    return;
  }

  await reply.send(service);
};

export const deleteServiceController = async (
  request: FastifyRequest<{
    Params: GetServiceParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const deleted = await deleteExistingService(id);

  if (!deleted) {
    await reply.code(404).send({
      error: 'Service not found',
    });

    return;
  }

  await reply.code(204).send();
};
