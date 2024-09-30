import { Project } from '../database/entities/Project';
import { ProjectDTO } from '../../../shared/types/ProjectDTO';

export const mapProjectToProjectDTO = (project: Project): ProjectDTO => {
  return {
    id: project.id,
    name: project.name,
    privateProject: project.privateProject,
  };
};
