import {
  createLab,
  findAllLabs,
  type CreateLabData,
  type Lab,
} from '../repositories/lab.repository.js';

export const getLabs = async (): Promise<Lab[]> => {
  return findAllLabs();
};

export const createNewLab = async (
  data: CreateLabData,
): Promise<Lab> => {
  return createLab(data);
};
