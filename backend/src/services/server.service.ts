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
  return createServer(data);
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
  return updateServer(id, data);
};

export const deleteExistingServer = async (
  id: number,
): Promise<boolean> => {
  return deleteServer(id);
};
