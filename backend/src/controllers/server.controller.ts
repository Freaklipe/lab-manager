import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewServer,
  getServers,
  getServerById,
  updateExistingServer,
  deleteExistingServer,
} from '../services/server.service.js';

interface CreateServerRequest {
  lab_id: number;
  name: string;
  hostname?: string;
  ip_address?: string;
  operating_system?: string;
  status: string;
}

interface GetServerParams {
  id: string;
}

interface PatchServerRequest {
  name?: string;
  hostname?: string;
  ip_address?: string;
  operating_system?: string;
  status?: string;
}

export const createServerController = async (
  request: FastifyRequest<{
    Body: CreateServerRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const server = await createNewServer(request.body);

  await reply.code(201).send(server);
};

export const getServersController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const servers = await getServers();

  await reply.send(servers);
};

export const getServerByIdController = async (
  request: FastifyRequest<{
    Params: GetServerParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const server = await getServerById(id);

  if (!server) {
    await reply.code(404).send({
      error: 'Server not found',
    });

    return;
  }

  await reply.send(server);
};

export const patchServerController = async (
  request: FastifyRequest<{
    Params: GetServerParams;
    Body: PatchServerRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const server = await updateExistingServer(id, request.body);

  if (!server) {
    await reply.code(404).send({
      error: 'Server not found',
    });

    return;
  }

  await reply.send(server);
};

export const deleteServerController = async (
  request: FastifyRequest<{
    Params: GetServerParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const deleted = await deleteExistingServer(id);

  if (!deleted) {
    await reply.code(404).send({
      error: 'Server not found',
    });

    return;
  }

  await reply.code(204).send();
};
