import { getActiveEditorFolder, getWorkspaceFolderIfNoActiveEditor } from "./doclinFileReadWriteUtil";
import { executeShellCommand } from "./excecuteShellCommandUtil";
import logger from "./logger";

const GIT_URL_COMMAND = "git config --get remote.origin.url";
const GIT_BRANCH_COMMAND = "git rev-parse --abbrev-ref HEAD";

export const getGithubUrl = async () : Promise<string> => {
	return await executeGitCommand(GIT_URL_COMMAND);
};

export const getGitBranch = async () : Promise<string> => {
	return await executeGitCommand(GIT_BRANCH_COMMAND);
};

const executeGitCommand = async (command: string) => {
	try {
		const directory = getActiveEditorFolder() ?? getWorkspaceFolderIfNoActiveEditor();

		if (!directory) {
			logger.error("No folder or file is opened.");
			return "";
		}

		const { stdout }: {stdout: string} = await executeShellCommand(`cd ${directory.fsPath} && ${command}`);
		return stdout.trim();;

	} catch (error) {
		return "";
	}
};