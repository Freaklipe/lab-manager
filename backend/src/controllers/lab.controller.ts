import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createNewLab,
  getLabs
} from '../services/lab.service.js';

interface CreateLabRequest {
  name: string;
  description?: string;
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
