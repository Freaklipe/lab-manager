import {
  createLab,
  findAllLabs,
  findLabById,
  updateLab,
  type CreateLabData,
  type Lab,
  type UpdateLabData
} from '../repositories/lab.repository.js';

export const getLabs = async (): Promise<Lab[]> => {
  return findAllLabs();
};

export const createNewLab = async (
  data: CreateLabData,
): Promise<Lab> => {
  return createLab(data);
};

export const getLabById = async (
  id: number,
): Promise<Lab | null> => {
  return findLabById(id);
};

export const updateExistingLab = async (
  id: number,
  data: UpdateLabData,
): Promise<Lab | null> => {
  return updateLab(id, data);
};
