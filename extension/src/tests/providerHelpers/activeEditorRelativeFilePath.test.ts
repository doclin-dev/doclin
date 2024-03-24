import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import { getActiveEditorRelativeFilePath } from '../../providerHelpers/activeEditorRelativeFilePath';
import * as doclinFileReadWriteUtil from '../../utils/doclinFileReadWriteUtil';
import * as path from 'path';

const ACTIVE_EDITOR_URI: vscode.Uri = vscode.Uri.file('/path/to/activeEditor.txt');
const DOCLIN_FILE_PATH: vscode.Uri = vscode.Uri.file('/path/to/.doclin');
const DOCLIN_FOLDER_PATH: string = '/path/to';

suite('Testing getActiveEditorRelativeFilePath', () => {
	let activeEditorStub: SinonStub;
	let getExistingDoclinFileStub: SinonStub<any[], any>;

	setup(() => {
		activeEditorStub = stub(vscode.window, 'activeTextEditor');
		getExistingDoclinFileStub = stub(doclinFileReadWriteUtil, 'getExistingDoclinFile');
	});

	teardown(() => {
		activeEditorStub.restore();
		getExistingDoclinFileStub.restore();
	});

	test('should return empty string when no active editor is opened', async () => {
		activeEditorStub.get(() => null);

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
		const pathRelativeStub = stub(path, 'relative').returns('relative/path');

		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('relative/path');
		expect(pathRelativeStub.calledWith(DOCLIN_FOLDER_PATH, ACTIVE_EDITOR_URI.fsPath)).to.be.true;

		pathRelativeStub.restore();
	});

	test('should return empty string when active editor is outside doclin folder', async () => {
		activeEditorStub.get(() => ({
			document: {
				uri: ACTIVE_EDITOR_URI
			}
		}));
		getExistingDoclinFileStub.resolves(DOCLIN_FILE_PATH);
		const pathRelativeStub = stub(path, 'relative').returns('../outside/path');

		const result = await getActiveEditorRelativeFilePath();

		expect(result).to.equal('');
		expect(pathRelativeStub.calledWith(DOCLIN_FOLDER_PATH, ACTIVE_EDITOR_URI.fsPath)).to.be.true;

		pathRelativeStub.restore();
	});
});