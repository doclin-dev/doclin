import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { clearRelativeFilePathMapCache, getActiveEditorRelativeFilePath } from '../../providerHelpers/activeEditorRelativeFilePath';
import * as doclinFileReadWriteUtil from '../../utils/doclinFileReadWriteUtil';
import * as path from 'path';
import { GlobalStateManager } from '../../GlobalStateManager';

const ACTIVE_EDITOR_URI: vscode.Uri = vscode.Uri.file('/path/to/activeEditor.txt');
const DOCLIN_FILE_PATH: vscode.Uri = vscode.Uri.file('/path/to/.doclin');
const DOCLIN_FOLDER_PATH: string = '/path/to';

suite('Testing getActiveEditorRelativeFilePath', () => {
	let sandbox: SinonSandbox;
	let activeEditorStub: SinonStub;
	let getExistingDoclinFileStub: SinonStub<any[], any>;
	let pathRelativeStub: SinonStub;

	setup(() => {
		sandbox = createSandbox();
		activeEditorStub = sandbox.stub(vscode.window, 'activeTextEditor');
		getExistingDoclinFileStub = sandbox.stub(doclinFileReadWriteUtil, 'getExistingDoclinFile');
		pathRelativeStub = sandbox.stub(path, 'relative');
		sandbox.stub(GlobalStateManager, 'setState');
		sandbox.stub(GlobalStateManager, 'getState').resolves({});
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should return empty string when no active editor is opened', async () => {
		activeEditorStub.get(() => null);

		clearRelativeFilePathMapCache();
		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('');
	});

	test('should return empty string when doclin file does not exist', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));
		getExistingDoclinFileStub.resolves(null);

		clearRelativeFilePathMapCache();
		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('');
	});

	test('should return relative file path when doclin file exists and active editor is within doclin folder', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));
		
		getExistingDoclinFileStub.resolves(DOCLIN_FILE_PATH);
		pathRelativeStub.returns('relative/path');

		clearRelativeFilePathMapCache();
		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('relative/path');
		expect(pathRelativeStub.calledWith(DOCLIN_FOLDER_PATH, ACTIVE_EDITOR_URI.fsPath)).to.be.true;
	});

	test('should return empty string when active editor is outside doclin folder', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));
		getExistingDoclinFileStub.resolves(DOCLIN_FILE_PATH);
		pathRelativeStub.returns('../outside/path');

		clearRelativeFilePathMapCache();
		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('');
		expect(pathRelativeStub.calledWith(DOCLIN_FOLDER_PATH, ACTIVE_EDITOR_URI.fsPath)).to.be.true;
	});
});