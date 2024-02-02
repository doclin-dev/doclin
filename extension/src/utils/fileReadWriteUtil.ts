import * as vscode from "vscode";
import { DoclinFile } from "../types";

const doclinFileName = ".doclin";

export const readDoclinFile = async (): Promise<DoclinFile | null> => {
    try {
        const filePath = getFilePath();

        if (!filePath) {
            return null;
        }

        const fileExists = await vscode.workspace.fs.stat(filePath).then(
            () => true,
            () => false
        );

        if (fileExists) {
            const fileContent = await vscode.workspace.fs.readFile(filePath);
            return JSON.parse(fileContent.toString());
        }
        
        return null;
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("Doclin: Error while reading .doclin file " + error);
        return null;
    }
}

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
    try {
        const filePath = getFilePath();

        if (!filePath) {
            vscode.window.showErrorMessage("Doclin: Could not compute write file path for .doclin.")
            return;
        }
        
        const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
        const utf8Array = new Uint8Array(utf8Buffer);

        await vscode.workspace.fs.writeFile(filePath, utf8Array);
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("Doclin: Error while creating .doclin file " + error);
    }
}

const getFilePath = (): vscode.Uri | null => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const workspaceFolder = workspaceFolders[0];
    return vscode.Uri.joinPath(workspaceFolder.uri, doclinFileName);
}