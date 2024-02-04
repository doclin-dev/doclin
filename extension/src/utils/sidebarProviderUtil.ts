import { getAuthenticatedUser } from "../providerHelpers/authenticationProviderHelper"
import { getCurrentOrganization } from "../providerHelpers/organizationProviderHelper"
import { getCurrentProject } from "../providerHelpers/projectProviderHelper"
import { getGithubUrl, isFolderOrFileOpened } from "./doclinFileReadWriteUtil"

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