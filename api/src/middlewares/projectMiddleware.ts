import { NextFunction, Request, Response } from 'express';
import { ProjectRepository } from '../database/repositories/ProjectRepository';
import { Project } from '../database/entities/Project';
import { verifyOrganizationAccess } from './organizationMiddleware';

export const verifyProjectVisibility = async (req: Request, res: Response, next: NextFunction) => {
  const projectId: number = parseInt(req.params.projectId);
  const project: Project = await ProjectRepository.findProjectById(projectId);

  if (project.privateProject) {
    verifyOrganizationAccess(req, res, next);
    return;
  }

  next();
};
