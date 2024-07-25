import * as vscode from 'vscode';
import * as path from 'path';
import { getExistingDoclinFile } from '../utils/doclinFileReadWriteUtil';
import DoclinRelativePathCacheManager from '../utils/cache/DoclinRelativePathCacheManager';

export const getDoclinRelativeFilePath = async (documentUri: vscode.Uri): Promise<string> => {
  const activeEditorFilePath: string = documentUri.fsPath;
  const doclinRelativePathCacheManager = new DoclinRelativePathCacheManager();
  const cachedRelativePath: string | undefined = await doclinRelativePathCacheManager.get(activeEditorFilePath);

  if (cachedRelativePath) {
    return cachedRelativePath;
  }

  const doclinFilePath: vscode.Uri | null = await getExistingDoclinFile();

  if (doclinFilePath) {
    const doclinFolder: string = path.dirname(doclinFilePath.fsPath);
    const normalizedDoclinFolder: string = doclinFolder.split(path.sep).join(path.posix.sep);
    const normalizedActiveEditorFilePath: string = activeEditorFilePath.split(path.sep).join(path.posix.sep);
    const doclinRelativePath: string = path.posix.relative(normalizedDoclinFolder, normalizedActiveEditorFilePath);

    await doclinRelativePathCacheManager.set(activeEditorFilePath, doclinRelativePath);
    return doclinRelativePath;
  }

  return '';
};
