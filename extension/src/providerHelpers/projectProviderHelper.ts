import projectApi from "../api/projectApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { readDoclinFile } from "./doclinFile/readDoclinFile";
import { writeDoclinFile } from "./doclinFile/writeDoclinFile";
import logger from "../utils/logger";
import { DoclinFile } from "../types";

const UNAUTHORIZED = {
	unauthorized: true
};

export const getCurrentProjectId = async (): Promise<number|null> => {
	const fileJSON: DoclinFile = await readDoclinFile();

	return fileJSON?.projectId;
};

export const getCurrentProject = async () => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

	try {
		const response = await projectApi.getProject(projectId, organizationId);
		const payload = response?.data;
		const project = payload?.project;
		
		return project;
	} catch {
		return UNAUTHORIZED;
	}

};

export const getExistingProjects = async () => {
	const organizationId = await getCurrentOrganizationId();

	if (!organizationId) {return { projects: null };}

	const response = await projectApi.getProjects(organizationId);
	const payload = response?.data;
	const projects = payload?.projects;

	return projects;
};

export const postProject = async({ name, githubUrl }: { name: string, githubUrl: string }) => {
	const organizationId = await getCurrentOrganizationId();

	if (!organizationId) {return { 
		project: null 
	};}

	const response = await projectApi.postProject(organizationId, name, githubUrl);
	const payload = response?.data;
	const project = payload?.project;

	await storeProjectId(project.id);
	
	return project;
};

export const storeProjectId = async (projectId: number) => {
	try {
		const fileJSON: DoclinFile = await readDoclinFile();

		if (fileJSON) {
			fileJSON["projectId"] = projectId;

			await writeDoclinFile(fileJSON);
		}
	} catch (error: any) {
		logger.error(`An error occurred: ${error.message}`);
	}
};