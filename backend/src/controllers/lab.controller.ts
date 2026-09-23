import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewLab,
  getLabs,
  getLabById
} from '../services/lab.service.js';

interface CreateLabRequest {
  name: string;
  description?: string;
}

interface GetLabParams {
  id: string;
}

export const createLabController = async (
  request: FastifyRequest<{
    Body: CreateLabRequest;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const lab = await createNewLab(request.body);

  await reply.code(201).send(lab);
};

export const getLabsController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const labs = await getLabs();

  await reply.send(labs);
};

export const getLabByIdController = async (
  request: FastifyRequest<{
    Params: GetLabParams;
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = Number(request.params.id);

  const lab = await getLabById(id);

  if (!lab) {
    await reply.code(404).send({
      error: 'Lab not found',
    });

    return;
  }

  await reply.send(lab);
};
