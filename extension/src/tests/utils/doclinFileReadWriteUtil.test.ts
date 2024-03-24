import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { getExistingDoclinFile } from '../../utils/doclinFileReadWriteUtil';
import * as path from 'path';

const ACTIVE_EDITOR_FOLDER_URI: vscode.Uri = vscode.Uri.file(path.resolve(__dirname, '../../../testAssets/activeEditorFolder'));
const ACTIVE_EDITOR_URI: vscode.Uri = vscode.Uri.file(path.resolve(__dirname, '../../../testAssets/activeEditorFolder/activeEditor.txt'));
const WORKSPACE_FOLDER_URI: vscode.Uri = vscode.Uri.file(path.resolve(__dirname, '../../../testAssets/workspaceFolder'));

suite('Testing getExistingDoclinFile', () => {
	let activeEditorStub: SinonStub;
	let workspaceFoldersStub: SinonStub;

	setup(() => {
		activeEditorStub = stub(vscode.window, 'activeTextEditor');
		workspaceFoldersStub = stub(vscode.workspace, 'workspaceFolders');
	});

	teardown(() => {
		activeEditorStub.restore();
		workspaceFoldersStub.restore();
	});

	test('should return no existing doclin file when no active editor or workspace folder is opened', async () => {
		activeEditorStub.get(() => null);
		workspaceFoldersStub.get(() => []);

		const existingDoclinFile = await getExistingDoclinFile();

		expect(existingDoclinFile).to.be.null;
	});

	test('should return active editor doclin file when an active editor is opened and workspace is not open', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));

		workspaceFoldersStub.get(() => []);

		const existingDoclinFile = await getExistingDoclinFile();

		expect(existingDoclinFile?.toString()).to.equal(`${ACTIVE_EDITOR_FOLDER_URI.toString()}/.doclin`);
	});

	test('should return active editor doclin file when an active editor is opened and workspace is open', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));

		workspaceFoldersStub.get(() => [
			{ uri: WORKSPACE_FOLDER_URI }
		]);

		const existingDoclinFile = await getExistingDoclinFile();

		expect(existingDoclinFile?.toString()).to.equal(`${ACTIVE_EDITOR_FOLDER_URI.toString()}/.doclin`);
	});

	test('should return workspace folder doclin file when an active editor is not open and workspace is open', async () => {
		activeEditorStub.get(() => null);

		workspaceFoldersStub.get(() => [
			{ uri: WORKSPACE_FOLDER_URI }
		]);

		const existingDoclinFile = await getExistingDoclinFile();

		expect(existingDoclinFile?.toString()).to.equal(`${WORKSPACE_FOLDER_URI.toString()}/.doclin`);
	});
});