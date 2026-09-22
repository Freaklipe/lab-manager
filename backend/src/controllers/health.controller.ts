import type { FastifyReply, FastifyRequest } from 'fastify';
import { getHealth } from '../services/health.service.js';

export const healthController = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const health = getHealth();

  await reply.send(health);
};
