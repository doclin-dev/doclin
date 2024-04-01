import { GlobalStateManager } from "../GlobalStateManager";
import { GlobalStateType } from "../enums";
import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper";
import { getOrganization } from "../providerHelpers/organizationProviderHelper";
import { getProject } from "../providerHelpers/projectProviderHelper";
import logger from "./logger";
import { getExistingDoclinFile } from "./doclinFileReadWriteUtil";
import * as path from "path";
import { getGithubUrl } from "./gitProviderUtil";
import { clearFileThreadsCache } from "./threadCachingUtil";
import { getActiveEditorFolder, getWorkspaceFolder } from "./fileSystemUtil";
import { ExtensionState } from "../types";
import { clearRelativeFilePathMapCache } from "../providerHelpers/activeEditorRelativeFilePath";
import { readDoclinFile } from "../providerHelpers/doclinFile/readDoclinFile";
import { clearAllThreadsCache } from "../providerHelpers/threadProviderHelper";

export const getExtensionState = async (): Promise<ExtensionState> => {
	try {
		const doclinFile = await readDoclinFile();
		const organizationId = doclinFile.organizationId;
		const projectId = doclinFile.projectId;

		return {
			user: await getAuthenticatedUser(),
			organization: organizationId ? await getOrganization(organizationId) : null,
			project: (organizationId && projectId) ? await getProject(organizationId, projectId) : null,
			githubUrl: await getGithubUrl(),
			isFolderOrFileOpened: isFolderOrFileOpened()
		};
		
	} catch (error) {
		logger.error(`Error during get extension ${error}`);
		return { error };
	}
};

export const reloadAndGetExtensionState = async (): Promise<ExtensionState> => {
	clearAllThreadsCache();
	clearFileThreadsCache();
	clearRelativeFilePathMapCache();

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