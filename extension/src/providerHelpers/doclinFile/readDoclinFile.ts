import * as vscode from 'vscode';
import { DoclinFile } from '../../types';
import logger from '../../utils/logger';
import { getExistingDoclinFile } from '../../utils/doclinFileReadWriteUtil';
import { isLocalWorkspace } from '../../utils/fileSystemUtil';

export const readDoclinFile = async (): Promise<DoclinFile> => {
  try {
    const fileUri = await getExistingDoclinFile();

    if (fileUri) {
      if (isLocalWorkspace()) {
        return await readDoclinFileFromLocalUri(fileUri);
      } else {
        return await readDoclinFileFromVirtualUri(fileUri);
      }
    }

    return createDoclinFile();
  } catch (error) {
    const errorMessage = `Error while reading .doclin file ${error}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

const readDoclinFileFromLocalUri = async (fileUri: vscode.Uri): Promise<DoclinFile> => {
  const fileContent = await vscode.workspace.fs.readFile(fileUri);
  return JSON.parse(fileContent.toString()) as DoclinFile;
};

const readDoclinFileFromVirtualUri = async (fileUri: vscode.Uri): Promise<DoclinFile> => {
  const fileContent = await vscode.workspace.openTextDocument(fileUri);
  return JSON.parse(fileContent.getText()) as DoclinFile;
};

const createDoclinFile = (): DoclinFile => {
  return {
    organizationId: null,
    projectId: null,
  };
};
