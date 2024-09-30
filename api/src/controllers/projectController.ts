import { ProjectRepository } from '../database/repositories/ProjectRepository';
import { Project } from '../database/entities/Project';
import { Request, Response } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { mapProjectToProjectDTO } from '../mappers/projectToProjectDTOMapper';
import { ProjectDTO } from '../../../shared/types/ProjectDTO';
import { ProjectCreateDTO } from '../../../shared/types/ProjectCreateDTO';
import { ParamsDictionary } from '../types/ParamsDictionary';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const getProjects = async (req: Request<ParamsDictionary, ProjectDTO[], {}>, res: Response<ProjectDTO[]>) => {
  const organizationId: string = req.params.organizationId;
  const projects: Project[] = await ProjectRepository.findProjectsByOrganizationId(organizationId);
  const response: ProjectDTO[] = projects.map(mapProjectToProjectDTO);
  return res.send(response);
};

export const postProject = async (
  req: Request<ParamsDictionary, ProjectDTO, ProjectCreateDTO>,
  res: Response<ProjectDTO>
) => {
  const name: string = DOMPurify.sanitize(req.body.name);
  const organizationId: string = req.params.organizationId;
  const privateProject: boolean = req.body.privateProject;

  const project: Project = await Project.create({
    name: name,
    organizationId: organizationId,
    privateProject: privateProject,
  }).save();

  const response: ProjectDTO = mapProjectToProjectDTO(project);
  return res.send(response);
};

export const getProject = async (req: Request<ParamsDictionary, ProjectDTO, {}>, res: Response<ProjectDTO>) => {
  const projectId: number = parseInt(req.params.projectId);
  try {
    const project: Project = await ProjectRepository.findProjectById(projectId);
    const response: ProjectDTO = mapProjectToProjectDTO(project);
    res.send(response);
    return;
  } catch (error) {
    res.status(500).send();
  }
};
