import * as vscode from "vscode";
import organizationApi from "../api/organizationApi";

export const getExistingOrganizations = async () => {
    return "hello";
}

export const postOrganization = async({ name }: { name: string }) => {
    const response = await organizationApi.postOrganization(name);
    const payload = response?.data;
    const organization = payload?.organization;

    storeOrganizationId(organization.id);

    return organization;
}

export const getCurrentOrganizationId = () => {
    return "551c9801-0d43-4dd3-8386-cabe414eca2a";
}

const storeOrganizationId = async (organizationId: string) => {
    try {
        const fileName = ".doclin";
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            return;
        }

        const workspaceFolder = workspaceFolders[0];
        const filePath = vscode.Uri.joinPath(workspaceFolder.uri, fileName);

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

        fileJSON["organizationId"] = organizationId;

        const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
        const utf8Array = new Uint8Array(utf8Buffer);

        await vscode.workspace.fs.writeFile(filePath, utf8Array);
    } catch (error: any) {
        vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
    }
}