import * as vscode from "vscode";
import { DoclinFile } from "../types";

const doclinFileName = ".doclin";

export const readDoclinFile = async (): Promise<DoclinFile | undefined> => {
    const filePath = getFilePath();

    if (!filePath) return;

    const fileExists = await vscode.workspace.fs.stat(filePath).then(
        () => true,
        () => false
    );

    let fileJSON;

    if (fileExists) {
        const fileContent = await vscode.workspace.fs.readFile(filePath);
        fileJSON = JSON.parse(fileContent.toString());
    } else {
        fileJSON = {};
    }

    return fileJSON;
}

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
    const filePath = getFilePath();

    if (!filePath) return;
    
    const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
    const utf8Array = new Uint8Array(utf8Buffer);

    await vscode.workspace.fs.writeFile(filePath, utf8Array);
}

const getFilePath = (): vscode.Uri | undefined => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return;
    }

    const workspaceFolder = workspaceFolders[0];
    return vscode.Uri.joinPath(workspaceFolder.uri, doclinFileName);
}