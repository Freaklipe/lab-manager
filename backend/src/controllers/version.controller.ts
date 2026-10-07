import type { FastifyReply, FastifyRequest } from 'fastify';
import { getVersion } from '../services/version.service.js';

export const versionController = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const version = getVersion();

  await reply.send(version);
};
