import * as vscode from "vscode";
import { executeShellCommand } from "./providerHelperUtils";
import projectApi from "../api/projectApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";

export const getGithubUrl = async() : Promise<string> => {
    if (vscode.workspace.workspaceFolders) {
      const openedFolderUri: any = vscode.workspace.workspaceFolders[0]?.uri;
      const openedFolderPath: string = openedFolderUri.fsPath;
      
      if (openedFolderPath) {
        let { stdout }: {stdout: string} = await executeShellCommand(`cd ${openedFolderPath} && git config --get remote.origin.url`);
        return stdout;
      }
    }

    return "";
}

export const getCurrentProjectId = (): number => {
	return 19;
}

export const getExistingProjects = async () => {
    const organizationId = await getCurrentOrganizationId();

    if (!organizationId) return { project: null };

    const response = await projectApi.getProjects(organizationId);
    const payload = response?.data;
    const projects = payload?.projects;

    return projects;
}

export const postProject = async({ name }: { name: string }) => {
    const githubUrl: string = await getGithubUrl();
    const organizationId = await getCurrentOrganizationId();

    if (!githubUrl || !organizationId) return { project: null };

    const response = await projectApi.postProject(organizationId, name, githubUrl);
    const payload = response?.data;
    const project = payload?.project;

    return project;
}