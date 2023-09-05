import * as vscode from "vscode";
import { executeShellCommand } from "./providerHelperUtils";
import projectApi from "../api/projectApi";

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

export const getExistingProjects = async () => {
    const githubUrl: string = await getGithubUrl();
    const response = await projectApi.getProjects(githubUrl);
    const payload = response?.data;
    const projects = payload?.projects;

    return projects;
}

export const createProject = async({ name }: { name: string }) => {
    const githubUrl: string = await getGithubUrl();
    const response = await projectApi.postProject(name, githubUrl);
    const payload = response?.data;
    const project = payload?.project;

    return project;
}