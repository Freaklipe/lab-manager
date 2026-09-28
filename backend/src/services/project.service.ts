import { logger } from '../config/logger.js';
import {
  createProject,
  findAllProjects,
  findProjectById,
  updateProject,
  deleteProject,
  type CreateProjectData,
  type Project,
  type UpdateProjectData,
} from '../repositories/project.repository.js';

export const getProjects = async (): Promise<Project[]> => {
  return findAllProjects();
};

export const createNewProject = async (
  data: CreateProjectData,
): Promise<Project> => {
  const project = await createProject(data);

  logger.info(
    {
      projectId: project.id,
      projectName: project.name,
    },
    'Project created',
  );

  return project;
};

export const getProjectById = async (
  id: number,
): Promise<Project | null> => {
  return findProjectById(id);
};

export const updateExistingProject = async (
  id: number,
  data: UpdateProjectData,
): Promise<Project | null> => {
  const project = await updateProject(id, data);

  if (project) {
    logger.info(
      {
        projectId: project.id,
      },
      'Project updated',
    );
  }

  return project;
};

export const deleteExistingProject = async (
  id: number,
): Promise<boolean> => {
  const deleted = await deleteProject(id);

  if (deleted) {
    logger.info(
      {
        projectId: id,
      },
      'Project deleted',
    );
  }

  return deleted;
};
