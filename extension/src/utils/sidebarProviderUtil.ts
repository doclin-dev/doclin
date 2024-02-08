import { GlobalStateManager } from "../GlobalStateManager"
import { GlobalStateType } from "../enums"
import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper";
import { getCurrentOrganization } from "../providerHelpers/organizationProviderHelper";
import { getCurrentProject } from "../providerHelpers/projectProviderHelper";
import logger from "./logger";
import { getActiveEditorFolder, getExistingDoclinFilePath, getGithubUrl, isFolderOrFileOpened } from "./doclinFileReadWriteUtil"
import * as path from "path";
import logger from "./logger";

export const getExtensionState = async () => {
	try {
		return {
			user: await getAuthenticatedUser(),
			organization: await getCurrentOrganization(),
			project: await getCurrentProject(),
			githubUrl: await getGithubUrl(),
      isFolderOrFileOpened: isFolderOrFileOpened()
		};
	} catch (error) {
		logger.error(`Error during get extension ${error}`);
		return { error };
	}
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

    const doclinFilePath = await getExistingDoclinFilePath();
    const doclinFolder = doclinFilePath ? path.dirname(doclinFilePath.fsPath) : null;

    GlobalStateManager.setState(GlobalStateType.DOCLIN_FOLDER, doclinFolder);
    return true;

  } catch (error) {
    logger.error(`Error during switching active editor`);
    return true;
  }
}