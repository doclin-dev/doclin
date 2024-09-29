import { SnippetResponseDTO } from '$shared/types/SnippetResponseDTO';
import { Snippet } from '../types';
import * as vscode from 'vscode';
import logger from '../utils/logger';
import { getExistingDoclinFile } from '../utils/doclinFileReadWriteUtil';
import * as path from 'path';
import { isLocalWorkspace } from '../utils/fileSystemUtil';
import { decodeHtmlEntities } from '../utils/snippetFormatUtil';

export const mapSnippetResponseDTOToSnippet = async (snippetDTO: SnippetResponseDTO): Promise<Snippet> => {
  if (!isLocalWorkspace()) {
    return {
      ...snippetDTO,
      outdated: false,
      updatedRange: new vscode.Range(0, 0, 0, 0),
    };
  }

  let outdated: boolean;
  let updatedRange: vscode.Range = new vscode.Range(0, 0, 0, 0);

  const document = await readFileContent(snippetDTO.filePath);
  if (document) {
    let content = document.getText();

    content = removeLineBreaks(decodeHtmlEntities(content));
    const snippetText = removeLineBreaks(decodeHtmlEntities(snippetDTO.text));
    const startIndex = content.indexOf(snippetText);

    if (startIndex === -1) {
      outdated = true;
    } else {
      outdated = false;

      const endIndex = startIndex + snippetText.length;
      const startPos = document.positionAt(startIndex);
      const endPos = document.positionAt(endIndex);

      updatedRange = new vscode.Range(startPos, endPos);
    }
  } else {
    outdated = true;
    updatedRange;
  }

  return {
    ...snippetDTO,
    updatedRange: updatedRange,
    outdated: outdated,
  };
};

const readFileContent = async (filePath: string): Promise<vscode.TextDocument | null> => {
  try {
    const doclinFilePath = await getExistingDoclinFile();

    if (!doclinFilePath) {
      logger.error('Could not find doclin file path');
      return null;
    }

    const doclinFolder = vscode.Uri.file(path.dirname(doclinFilePath.fsPath));

    const fileUri = vscode.Uri.joinPath(doclinFolder, filePath);

    return await vscode.workspace.openTextDocument(fileUri);
  } catch (error) {
    return null;
  }
};

const removeLineBreaks = (text: string) => {
  return text.replace(/\n/g, ' ');
};
