import { GlobalStateManager } from "../GlobalStateManager"
import { GlobalStateType } from "../enums"
import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper"
import { getCurrentOrganization } from "../providerHelpers/organizationProviderHelper"
import { getCurrentProject } from "../providerHelpers/projectProviderHelper"
import { getActiveEditorFolder, getExistingDoclinFilePath, getGithubUrl, isFolderOrFileOpened } from "./doclinFileReadWriteUtil"
import * as path from "path";
import logger from "./logger"

export const getExtensionState = async () => {
  try {
    return {
      user: await getAuthenticatedUser(),
      organization: await getCurrentOrganization(),
      project: await getCurrentProject(),
      githubUrl: await getGithubUrl(),
      isFolderOrFileOpened: isFolderOrFileOpened()
    }
  } catch (error) {
    return { error }
  }
}

export const isDoclinProjectChanged = async (): Promise<boolean> => {
  try {
    const storedDoclinFolder: string | undefined = await GlobalStateManager.getState(GlobalStateType.DOCLIN_FOLDER) ?? "";
    const activeEditorFolder = getActiveEditorFolder();

    if (!activeEditorFolder) {
      return true;
    }

    if (storedDoclinFolder && activeEditorFolder.fsPath.startsWith(storedDoclinFolder)) {
      return false;
    }

    const doclinFilePath = await getExistingDoclinFilePath();

    if (!doclinFilePath) {
      GlobalStateManager.setState(GlobalStateType.DOCLIN_FOLDER, "");
      return true;
    }

    const doclinFolder = path.dirname(doclinFilePath.fsPath);
    GlobalStateManager.setState(GlobalStateType.DOCLIN_FOLDER, doclinFolder);
    return true;

  } catch (error) {
    logger.error(`Error during switching active editor`);
    return true;
  }
}