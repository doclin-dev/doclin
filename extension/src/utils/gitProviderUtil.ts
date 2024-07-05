import { getActiveEditorFolder, getWorkspaceFolder } from './fileSystemUtil';
import { executeShellCommand } from './excecuteShellCommandUtil';

const GIT_BRANCH_COMMAND = 'git rev-parse --abbrev-ref HEAD';

export const getGitBranch = async (): Promise<string> => {
  return await executeGitCommand(GIT_BRANCH_COMMAND);
};

const executeGitCommand = async (command: string) => {
  try {
    const directory = getActiveEditorFolder() ?? getWorkspaceFolder();

    if (!directory) {
      return '';
    }

    const { stdout }: { stdout: string } = await executeShellCommand(`cd ${directory.fsPath} && ${command}`);
    return stdout.trim();
  } catch (error) {
    return '';
  }
};
