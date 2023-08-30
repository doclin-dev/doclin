import * as vscode from "vscode";
import { SidebarProvider } from "../SidebarProvider";
import * as path from "path";
import { exec } from 'child_process';

interface ShellOutput {
    stdout: string;
    stderr: string;
}

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd: string): Promise<ShellOutput> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

export const getGithubUrl = async() : Promise<string> => {
  if (vscode.workspace.workspaceFolders) {
    const openedFolderUri: any = vscode.workspace.workspaceFolders[0]?.uri;
    const openedFolderPath: string = openedFolderUri.fsPath;
    
    if (openedFolderPath) {
      let { stdout }: {stdout: string} = await sh(`cd ${openedFolderPath} && git config --get remote.origin.url`);
      return stdout;
    }
  }
  return "";
}

export const getGitRelativePath = async () : Promise<string> => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    return "";
  }

  const activeFilePath: string = activeTextEditor.document.uri.fsPath;
  const activeDirectory: string = path.dirname(activeFilePath);
  const activeFileName = path.basename(activeFilePath);

  let { stdout }: {stdout: string} = await sh(`cd ${activeDirectory} && git rev-parse --show-prefix ${activeFileName}`);
  return stdout.split('\n')[0] + activeFileName;
}

export const addCodeSnippet = async (sidebarProvider: any) => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    vscode.window.showInformationMessage("No active text editor");
    return;
  }

  vscode.commands.executeCommand('workbench.view.extension.doclin-sidebar-view');

  const filePath = await getGitRelativePath();

  const threadMessage = activeTextEditor.document.getText(
    activeTextEditor.selection
  );

  // Provdies the line numbers of selected text in active editor. 
  // const selection = activeTextEditor.selection;
  // console.log(selection);
  // if (!selection.isEmpty) {
  //   const startLine = selection.start.line + 1; // Line numbers are zero-based, so add 1
  //   const endLine = selection.end.line + 1;

  //   console.log(`Selected text lines: ${startLine}-${endLine}`);
  // } else {
  //     console.log('No text selected');
  // }

  const pauseExecution = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500); // Resolves the promise after 2 seconds
    });
  }

  await pauseExecution(); 
  // TODO: bug - not the most ideal way to fix this!!
  // Need to check when the sidebar is loaded and then add the textSelection to sidebar

  sidebarProvider._view?.webview.postMessage({
    type: "populate-thread-message",
    value: {filePath, threadMessage},
  });
}