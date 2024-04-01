import { ProjectRepository } from "../database/repositories/ProjectRepository";
import { Project } from "../database/entities/Project";
import { OrganizationRepository } from "../database/repositories/OrganizationRepository";
import { Request, Response } from "express";

export const getProjects = async (req: any, res: any) => {
	const organizationId: string = req.params.organizationId;

	const projects = await ProjectRepository.findProjectsByOrganizationId(organizationId);

	const responseProjects = projects.map(project => ({
		id: project.id,
		name: project.name
	}));

	return res.send({ projects: responseProjects });
};

export const postProject = async (req:any, res:any) => {
	const name = req.body.name;
	const organizationId = req.params.organizationId;

	const organization = await OrganizationRepository.findOrganizationById(organizationId);

	if (!organization) {return;}

	const project = await Project.create({
		name: name,
		organizationId: organizationId
	}).save();

	return res.send({ project });
};

export const getProject = async (req: Request, res: Response) => {
	const projectId: number = parseInt(req.params.projectId);

	const project = await ProjectRepository.findProjectById(projectId);

	if (!project) {
		res.send({ project: null });
		return;
	}

	const responseProject = {
		id: project.id,
		name: project.name
	};

	res.send({ project: responseProject });
};