import * as vscode from "vscode";
import { DoclinFile } from "../types";
import logger from "./logger";

const DOCLIN_FILE_NAME = ".doclin";

export const readDoclinFile = async (): Promise<DoclinFile | null> => {
    try {
        const filePath = getFilePath();

        if (!filePath) {
            throw Error("Could not compute .doclin filepath");
        }

        const fileExists = await vscode.workspace.fs.stat(filePath).then(
            () => true,
            () => false
        );

        if (fileExists) {
            const fileContent = await vscode.workspace.fs.readFile(filePath);
            return JSON.parse(fileContent.toString());
        }
        
        return {
            organizationId: null,
            projectId: null
        };
    } catch (error) {
        logger.error("Error while reading .doclin file " + error);
        return null;
    }
}

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
    try {
        const filePath = getFilePath();

        if (!filePath) {
            logger.error("Could not compute write file path for .doclin.")
            return;
        }
        
        const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
        const utf8Array = new Uint8Array(utf8Buffer);

        await vscode.workspace.fs.writeFile(filePath, utf8Array);
    } catch (error) {
        logger.error("Error while creating .doclin file " + error);
    }
}

const getFilePath = (): vscode.Uri | null => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const workspaceFolder = workspaceFolders[0];
    return vscode.Uri.joinPath(workspaceFolder.uri, DOCLIN_FILE_NAME);
}