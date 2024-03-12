import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonStub, stub, replace, match } from 'sinon';
import * as writeDoclinFile from '../../../providerHelpers/doclinFile/writeDoclinFile';
import { DoclinFile } from '../../../types';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as doclinFileReadWriteUtil from '../../../utils/doclinFileReadWriteUtil';
import * as fileSystemUtil from '../../../utils/fileSystemUtil';

const DOCLIN_FILE: DoclinFile = {
	organizationId: "test-org-id",
	projectId: 69
};

const EXISTING_DOCLIN_FILE = '/test/.existingDoclin';
const GIT_FOLDER = '/test/testGitFolder';
const ACTIVE_EDITOR_FOLDER = '/test/activeEditorFolder';
const WORKSPACE_FOLDER = '/test/gitFolder/workspaceFolder';

describe('Testing writeDoclinFile', () => {
	let writeToFilePathStub: SinonStub;
	let getExistingDoclinFilePathStub: SinonStub;
	let getGitRootFolderStub: SinonStub;
	let getActiveEditorFolderStub: SinonStub;
	let getWorkspaceFolderStub: SinonStub;
	let activeEditorStub: SinonStub;

	beforeEach(() => {
		writeToFilePathStub = stub(fileSystemUtil, 'writeToFilePath').resolves();
		getExistingDoclinFilePathStub = stub(doclinFileReadWriteUtil, 'getExistingDoclinFile');
		getGitRootFolderStub = stub(writeDoclinFile, 'getGitRootFolder');
		getActiveEditorFolderStub = stub(fileSystemUtil, 'getActiveEditorFolder');
		getWorkspaceFolderStub = stub(fileSystemUtil, 'getWorkspaceFolder');
		activeEditorStub = stub(vscode.window, 'activeTextEditor');
	});

	afterEach(() => {
		getExistingDoclinFilePathStub.restore();
		writeToFilePathStub.restore();
		getGitRootFolderStub.restore();
		getActiveEditorFolderStub.restore();
		getWorkspaceFolderStub.restore();
		activeEditorStub.restore();
	});

	it('should write to existing doclin file if it exists', async () => {
		getExistingDoclinFilePathStub.resolves(vscode.Uri.file(EXISTING_DOCLIN_FILE));

		await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(EXISTING_DOCLIN_FILE, match.any));
	});

	it("should write to the active editor's git directory when no existing doclin file is found", async() => {
		getExistingDoclinFilePathStub.resolves(null);
		getGitRootFolderStub.resolves(vscode.Uri.file(GIT_FOLDER));
		getActiveEditorFolderStub.returns(vscode.Uri.file(ACTIVE_EDITOR_FOLDER));
		activeEditorStub.returns(true);

		await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(`${GIT_FOLDER}/.doclin`, match.any));
	});

	it("should write to the current directory of the active editor when no existing doclin file is found and the editor is not in a git directory", async() => {
		getExistingDoclinFilePathStub.resolves(null);
		getGitRootFolderStub.resolves(null);
		getActiveEditorFolderStub.returns(vscode.Uri.file(ACTIVE_EDITOR_FOLDER));
		activeEditorStub.returns(true);

		await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(`${ACTIVE_EDITOR_FOLDER}/.doclin`, match.any));
	});

	it("should write to the Git directory of the workspace folder when no existing doclin file is found and no active editor is open", async() => {
		getExistingDoclinFilePathStub.resolves(null);
		getGitRootFolderStub.resolves(vscode.Uri.file(GIT_FOLDER));
		getActiveEditorFolderStub.returns(null);
		getWorkspaceFolderStub.returns(vscode.Uri.file(WORKSPACE_FOLDER));
		activeEditorStub.get(() => null);

		await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(`${GIT_FOLDER}/.doclin`, match.any));
	});

	it("should write to the workspace folder when no existing doclin file is found, no active editor is open, and the workspace folder is not a Git directory", async() => {
		getExistingDoclinFilePathStub.resolves(null);
		getGitRootFolderStub.resolves(null);
		getActiveEditorFolderStub.returns(null);
		getWorkspaceFolderStub.returns(vscode.Uri.file(WORKSPACE_FOLDER));
		activeEditorStub.get(() => null);

		await writeDoclinFile.writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(`${WORKSPACE_FOLDER}/.doclin`, match.any));
	});
});