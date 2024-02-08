import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper"
import { getCurrentOrganization } from "../providerHelpers/organizationProviderHelper"
import { getCurrentProject, getGithubUrl } from "../providerHelpers/projectProviderHelper"
import logger from "./logger"

export const getExtensionState = async () => {
  try {
    return {
      user: await getAuthenticatedUser(),
      organization: await getCurrentOrganization(),
      project: await getCurrentProject(),
      githubUrl: await getGithubUrl()
    }
  } catch (error) {
    logger.error(`Error during get extension ${error}`);
    return { error }
  }
}