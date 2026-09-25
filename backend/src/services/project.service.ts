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
  return createProject(data);
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
  return updateProject(id, data);
};

export const deleteExistingProject = async (
  id: number,
): Promise<boolean> => {
  return deleteProject(id);
};
