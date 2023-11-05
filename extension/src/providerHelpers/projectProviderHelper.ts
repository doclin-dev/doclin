import * as vscode from "vscode";
import { executeShellCommand } from "./providerHelperUtils";
import projectApi from "../api/projectApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { readDoclinFile, writeDoclinFile } from "../utils/fileReadWriteUtil";

const ACCESS_REQUIRED = "accessRequired";

export const getGithubUrl = async() : Promise<string|undefined> => {
	if (vscode.workspace.workspaceFolders) {
		const openedFolderUri: any = vscode.workspace.workspaceFolders[0]?.uri;
		const openedFolderPath: string = openedFolderUri.fsPath;
		try {
			if (openedFolderPath) {
				let { stdout }: {stdout: string} = await executeShellCommand(`cd ${openedFolderPath} && git config --get remote.origin.url`);
				return stdout;
			}
		} catch {
			return;
		}
	}
}

export const getCurrentProjectId = async (): Promise<number|undefined> => {
	const fileJSON = await readDoclinFile();

		return fileJSON?.projectId;
}

export const getCurrentProject = async () => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) return;

	try {
		const response = await projectApi.getProject(projectId, organizationId);
		const payload = response?.data;
		const project = payload?.project;
		
		return project;
	} catch {
		return ACCESS_REQUIRED;
	}

}

export const getExistingProjects = async () => {
	const organizationId = await getCurrentOrganizationId();

	if (!organizationId) return { projects: null };

	const response = await projectApi.getProjects(organizationId);
	const payload = response?.data;
	const projects = payload?.projects;

	return projects;
}

export const postProject = async({ name }: { name: string }) => {
	const githubUrl = await getGithubUrl();
	const organizationId = await getCurrentOrganizationId();

	if (!githubUrl || !organizationId) return { project: null };

	const response = await projectApi.postProject(organizationId, name, githubUrl);
	const payload = response?.data;
	const project = payload?.project;

	await storeProjectId(project.id);
	
	return project;
}

export const storeProjectId = async (projectId: number) => {
	try {
		const fileJSON = await readDoclinFile();

		if (fileJSON) {
			fileJSON["projectId"] = projectId;

			writeDoclinFile(fileJSON);
		}
	} catch (error: any) {
		vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
	}
}

export const inviteUser = async({ email }: { email: string }) => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !email || !projectId) {
		return;
	}

	const response = await projectApi.inviteUser(projectId, organizationId, email);
	const payload = response?.data;
	
	return payload;
}