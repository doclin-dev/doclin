import * as vscode from 'vscode';
import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import * as writeDoclinFile from '../../../providerHelpers/doclinFile/writeDoclinFile';
import { DoclinFile } from '../../../types';
import * as doclinFileReadWriteUtil from '../../../utils/doclinFileReadWriteUtil';
import * as fileSystemUtil from '../../../utils/fileSystemUtil';

const DOCLIN_FILE: DoclinFile = {
  organizationId: 'test-org-id',
  projectId: 69,
};

const EXISTING_DOCLIN_FILE_URI: vscode.Uri = vscode.Uri.file('/test/.existingDoclin');
const GIT_FOLDER_URI: vscode.Uri = vscode.Uri.file('/test/testGitFolder');
const ACTIVE_EDITOR_FOLDER_URI: vscode.Uri = vscode.Uri.file('/test/activeEditorFolder');
const ACTIVE_EDITOR_URI: vscode.Uri = vscode.Uri.file('/test/activeEditorFolder/activeEditor.js');
const WORKSPACE_FOLDER_URI: vscode.Uri = vscode.Uri.file('/test/workspaceFolder');

suite('Testing writeDoclinFile', () => {
  let sandbox: SinonSandbox;
  let writeToFilePathStub: SinonStub;
  let getExistingDoclinFilePathStub: SinonStub;
  let getGitRootFolderStub: SinonStub;
  let activeEditorStub: SinonStub;
  let workspaceFoldersStub: SinonStub;

  setup(() => {
    sandbox = createSandbox();
    writeToFilePathStub = sandbox.stub(fileSystemUtil, 'writeToFilePath');
    getExistingDoclinFilePathStub = sandbox.stub(doclinFileReadWriteUtil, 'getExistingDoclinFile');
    getGitRootFolderStub = sandbox.stub(writeDoclinFile, 'getGitRootFolder');
    activeEditorStub = sandbox.stub(vscode.window, 'activeTextEditor');
    workspaceFoldersStub = sandbox.stub(vscode.workspace, 'workspaceFolders');
  });

  teardown(() => {
    sandbox.restore();
  });

  test('should write to existing doclin file if it exists', async () => {
    getExistingDoclinFilePathStub.resolves(EXISTING_DOCLIN_FILE_URI);
    getGitRootFolderStub.resolves(GIT_FOLDER_URI);
    activeEditorStub.get(() => null);
    workspaceFoldersStub.get(() => []);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(EXISTING_DOCLIN_FILE_URI.toString());
  });

  test("should write to the active editor's git directory when no existing doclin file is found", async () => {
    getExistingDoclinFilePathStub.resolves(null);
    getGitRootFolderStub.resolves(GIT_FOLDER_URI);

    activeEditorStub.get(() => ({
      document: {
        uri: ACTIVE_EDITOR_URI,
      },
    }));

    const workspaceFolders = [{ uri: WORKSPACE_FOLDER_URI }];

    workspaceFoldersStub.get(() => workspaceFolders);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(`${GIT_FOLDER_URI.toString()}/.doclin`);
  });

  test(`should write to the current directory of the active editor when 
		1. no existing doclin file is found, 
		2. the editor is not in a git directory, and 
		3. when workspace folder is not opened`, async () => {
    getExistingDoclinFilePathStub.resolves(null);
    getGitRootFolderStub.resolves(null);

    activeEditorStub.get(() => ({
      document: {
        uri: ACTIVE_EDITOR_URI,
      },
    }));

    workspaceFoldersStub.get(() => null);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(`${ACTIVE_EDITOR_FOLDER_URI.toString()}/.doclin`);
  });

  test(`should write to the current directory of the active editor when 
		1. no existing doclin file is found, 
		2. the editor is not in a git directory, and 
		3. when workspace folder is opened`, async () => {
    getExistingDoclinFilePathStub.resolves(null);
    getGitRootFolderStub.resolves(null);

    activeEditorStub.get(() => ({
      document: {
        uri: ACTIVE_EDITOR_URI,
      },
    }));

    workspaceFoldersStub.get(() => [{ uri: WORKSPACE_FOLDER_URI }]);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(`${ACTIVE_EDITOR_FOLDER_URI.toString()}/.doclin`);
  });

  test('should write to the Git directory of the workspace folder when no existing doclin file is found and no active editor is open', async () => {
    getExistingDoclinFilePathStub.resolves(null);
    getGitRootFolderStub.resolves(GIT_FOLDER_URI);
    activeEditorStub.get(() => null);

    workspaceFoldersStub.get(() => [{ uri: WORKSPACE_FOLDER_URI }]);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(`${GIT_FOLDER_URI.toString()}/.doclin`);
  });

  test(`should write to the workspace folder when 
		1. no existing doclin file is found, 
		2. no active editor is open, and 
		3. the workspace folder is not a Git directory`, async () => {
    getExistingDoclinFilePathStub.resolves(null);
    getGitRootFolderStub.resolves(null);
    activeEditorStub.get(() => null);

    const workspaceFolders = [{ uri: WORKSPACE_FOLDER_URI }];

    workspaceFoldersStub.get(() => workspaceFolders);

    await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

    expect(writeToFilePathStub.calledOnce).to.be.true;
    expect(writeToFilePathStub.firstCall.args[0].toString()).to.equal(`${WORKSPACE_FOLDER_URI.toString()}/.doclin`);
  });
});
