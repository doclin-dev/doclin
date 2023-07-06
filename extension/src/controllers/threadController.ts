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

export const addCodeSnippet = async (sidebarProvider: any) => {
    const { activeTextEditor } = vscode.window;

    const view = vscode.window

    if (!activeTextEditor) {
      vscode.window.showInformationMessage("No active text editor");
      return;
    }

    const activeFilePath: string = activeTextEditor.document.uri.fsPath;
    const activeDirectory: string = path.dirname(activeFilePath);
    const activeFileName = path.basename(activeFilePath);

    let { stdout }: {stdout: string} = await sh(`cd ${activeDirectory} && git rev-parse --show-prefix ${activeFileName}`);
    const gitRelativeFilePath = stdout.split('\n')[0] + activeFileName;

    vscode.commands.executeCommand('workbench.view.extension.doclin-sidebar-view');

    const message = activeTextEditor.document.getText(
      activeTextEditor.selection
    );

    const threadMessage = `
${gitRelativeFilePath}
\`\`\`javascript
${message}
\`\`\`
    `;

    const pauseExecution = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 500); // Resolves the promise after 2 seconds
      });
    }

    await pauseExecution(); 
    // Bug: not the most ideal way to fix this!!
    // Need to check when the sidebar is loaded and then add the textSelection to sidebar

    sidebarProvider._view?.webview.postMessage({
      type: "populate-thread-message",
      value: threadMessage,
    });
}