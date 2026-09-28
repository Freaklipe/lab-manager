import { logger } from '../config/logger.js';
import {
  createServer,
  findAllServers,
  findServerById,
  updateServer,
  deleteServer,
  type CreateServerData,
  type Server,
  type UpdateServerData,
} from '../repositories/server.repository.js';

export const getServers = async (): Promise<Server[]> => {
  return findAllServers();
};

export const createNewServer = async (
  data: CreateServerData,
): Promise<Server> => {
  const server = await createServer(data);

  logger.info(
    {
      serverId: server.id,
    },
    'Server created',
  );

  return server;
};

export const getServerById = async (
  id: number,
): Promise<Server | null> => {
  return findServerById(id);
};

export const updateExistingServer = async (
  id: number,
  data: UpdateServerData,
): Promise<Server | null> => {
  const server = await updateServer(id, data);

  if (server) {
    logger.info(
      {
        serverId: server.id,
      },
      'Server updated',
    );
  }

  return server;
};

export const deleteExistingServer = async (
  id: number,
): Promise<boolean> => {
  const deleted = await deleteServer(id);

  if (deleted) {
    logger.info(
      {
        serverId: id,
      },
      'Server deleted',
    );
  }

  return deleted;
};
