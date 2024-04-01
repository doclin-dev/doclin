import { GlobalStateManager } from "../GlobalStateManager";
import { GlobalStateType } from "../enums";
import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper";
import { getOrganization } from "../providerHelpers/organizationProviderHelper";
import { getProject } from "../providerHelpers/projectProviderHelper";
import logger from "./logger";
import { getExistingDoclinFile } from "./doclinFileReadWriteUtil";
import * as path from "path";
import { getActiveEditorFolder, getWorkspaceFolder } from "./fileSystemUtil";
import { ExtensionState } from "../types";
import { readDoclinFile } from "../providerHelpers/doclinFile/readDoclinFile";
import OrganizationCacheManager from "./cache/OrganizationCacheManager";
import AllThreadsCacheManager from "./cache/AllThreadsCacheManager";
import FileThreadCacheManager from "./cache/FileThreadsCacheManager";
import ProjectCacheMananger from "./cache/ProjectCacheManager";
import DoclinRelativePathCacheManager from "./cache/DoclinRelativePathCacheManager";
import AuthenticatedUserCacheManager from "./cache/AuthenticatedUserCacheManager";

export const getExtensionState = async (): Promise<ExtensionState> => {
	try {
		const doclinFile = await readDoclinFile();
		const organizationId = doclinFile.organizationId;
		const projectId = doclinFile.projectId;

		return {
			user: await getAuthenticatedUser(),
			organization: organizationId ? await getOrganization(organizationId) : null,
			project: (organizationId && projectId) ? await getProject(organizationId, projectId) : null,
			isFolderOrFileOpened: isFolderOrFileOpened()
		};
		
	} catch (error) {
		logger.error(`Error during get extension ${error}`);
		return { error };
	}
};

export const reloadAndGetExtensionState = async (): Promise<ExtensionState> => {
	const authenticatedUserCacheManager = new AuthenticatedUserCacheManager;
	await authenticatedUserCacheManager.clear();

	const projectCacheManager = new ProjectCacheMananger();
	await projectCacheManager.clear();
	
	const organizationCacheManager = new OrganizationCacheManager();
	await organizationCacheManager.clear();

	const allThreadsCacheManager = new AllThreadsCacheManager();
	await allThreadsCacheManager.clear();

	const fileThreadCacheManager = new FileThreadCacheManager();
	await fileThreadCacheManager.clear();

	const doclinRelativePathCacheManager = new DoclinRelativePathCacheManager();
	await doclinRelativePathCacheManager.clear();

	return await getExtensionState();
};

export const isDoclinProjectChanged = async (): Promise<boolean> => {
	try {
		const activeEditorFolder = getActiveEditorFolder();

		if (!activeEditorFolder) {
			return true;
		}

		let storedDoclinFolder: string | null | undefined = await GlobalStateManager.getState(GlobalStateType.DOCLIN_FOLDER);

		if (storedDoclinFolder && activeEditorFolder.fsPath.startsWith(storedDoclinFolder)) {
			return false;
		}

		const doclinFilePath = await getExistingDoclinFile();
		const doclinFolder = doclinFilePath ? path.dirname(doclinFilePath.fsPath) : null;

		GlobalStateManager.setState(GlobalStateType.DOCLIN_FOLDER, doclinFolder);
		return true;

	} catch (error) {
		logger.error(`Error during switching active editor`);
		return true;
	}
};

const isFolderOrFileOpened = (): boolean => {
	const folderPath = getActiveEditorFolder() ?? getWorkspaceFolder();

	if (folderPath) {
		return true;
	}

	return false;
};