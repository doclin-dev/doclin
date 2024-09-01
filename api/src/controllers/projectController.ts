import { ProjectRepository } from '../database/repositories/ProjectRepository';
import { Project } from '../database/entities/Project';
import { OrganizationRepository } from '../database/repositories/OrganizationRepository';
import { Request, Response } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Organization } from '../database/entities/Organization';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const getProjects = async (req: Request, res: Response) => {
  const organizationId: string = req.params.organizationId;

  const projects = await ProjectRepository.findProjectsByOrganizationId(organizationId);

  const responseProjects = projects.map((project) => ({
    id: project.id,
    name: project.name,
  }));

  return res.send({ projects: responseProjects });
};

export const postProject = async (req: Request, res: Response) => {
  const name: string = DOMPurify.sanitize(req.body.name);
  const organizationId: string = req.params.organizationId;
  const privateProject: boolean = req.body.privateProject;

  const organization: Organization | null = await OrganizationRepository.findOrganizationById(organizationId);

  if (!organization) {
    return;
  }

  const project = await Project.create({
    name: name,
    organizationId: organizationId,
    privateProject: privateProject,
  }).save();

  return res.send({ project });
};

export const getProject = async (req: Request, res: Response) => {
  const projectId: number = parseInt(req.params.projectId);

  const project: Project = await ProjectRepository.findProjectById(projectId);

  const responseProject = {
    id: project.id,
    name: project.name,
  };

  res.send({ project: responseProject });
};
