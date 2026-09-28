import { logger } from '../config/logger.js';
import {
  createLab,
  findAllLabs,
  findLabById,
  updateLab,
  deleteLab,
  type CreateLabData,
  type Lab,
  type UpdateLabData,
} from '../repositories/lab.repository.js';

export const getLabs = async (): Promise<Lab[]> => {
  return findAllLabs();
};

export const createNewLab = async (
  data: CreateLabData,
): Promise<Lab> => {
  const lab = await createLab(data);

  logger.info(
    {
      labId: lab.id,
      labName: lab.name,
    },
    'Lab created',
  );

  return lab;
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
  const lab = await updateLab(id, data);

  if (lab) {
    logger.info(
      {
        labId: lab.id,
      },
      'Lab updated',
    );
  }
  return lab;
};

export const deleteExistingLab = async (
  id: number,
): Promise<boolean> => {
  const deleted = await deleteLab(id);

  if (deleted) {
    logger.info(
      {
        labId: id,
      },
      'Lab deleted',
    );
  }

  return deleted;
};
