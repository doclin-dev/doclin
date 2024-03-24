import * as vscode from 'vscode';
import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub, stub } from 'sinon';
import { addCodeSnippet } from '../../providerHelpers/addCodeSnippet';
import * as activeEditorRelativeFilePath from '../../providerHelpers/activeEditorRelativeFilePath';
import * as addCodeSnippetModule from '../../providerHelpers/addCodeSnippet';
import * as snippetComparisonUtil from '../../utils/snippetComparisonUtil';
import * as gitProviderUtil from '../../utils/gitProviderUtil';
import logger from '../../utils/logger'; // Import the logger module
import { SidebarProvider } from '../../SidebarProvider';

suite('Testing addCodeSnippet', () => {
	let sandbox: SinonSandbox;
	let executeCommandStub: SinonStub;
	let activeTextEditorStub: SinonStub;
	let getActiveEditorRelativeFilePathStub: SinonStub;
	let getTextStub: SinonStub;
	let getGitBranchStub: SinonStub;
	let postMessageStub: SinonStub;
	let sidebarProvider: SidebarProvider;
	let highlightCodeStub: SinonStub;
	let loggerErrorStub: SinonStub;

	setup(() => {
		sandbox = createSandbox();
		executeCommandStub = sandbox.stub(vscode.commands, 'executeCommand');
		activeTextEditorStub = sandbox.stub(vscode.window, 'activeTextEditor');
		getActiveEditorRelativeFilePathStub = sandbox.stub(activeEditorRelativeFilePath, 'getActiveEditorRelativeFilePath');
		getTextStub = sandbox.stub();
		getGitBranchStub = sandbox.stub(gitProviderUtil, 'getGitBranch');
		postMessageStub = sandbox.stub();

		sidebarProvider = {
			_view: {
				webview: {
					postMessage: postMessageStub
				}
			}
		} as unknown as SidebarProvider;

		highlightCodeStub = sandbox.stub(snippetComparisonUtil, 'highlightCode');
		loggerErrorStub = sandbox.stub(logger, 'error');
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should execute the command to open the doclin sidebar view', async () => {
		await addCodeSnippet(sidebarProvider);

		expect(executeCommandStub.calledWith('workbench.view.extension.doclinSidebarView')).to.be.true;
	});

	// TODO: complete
	// test('should return early if the extension is not ready for comment', async () => {
		
	// });

	test('should populate code snippet in the sidebar if there is an active text editor', async () => {
		const activeTextEditorValue = {
			document: {
				getText: getTextStub,
			},
			selection: {
				start: {
					line: 1
				}
			}
		} as unknown as vscode.TextEditor;

		getTextStub.returns('originalSnippet');
		activeTextEditorStub.get(() => activeTextEditorValue);
		getActiveEditorRelativeFilePathStub.resolves('filePath');
		highlightCodeStub.returns('highlightedSnippet');
		getGitBranchStub.resolves('gitBranch');

		await addCodeSnippet(sidebarProvider);

		expect(getActiveEditorRelativeFilePathStub.calledOnce).to.be.true;
		expect(getTextStub.calledOnce).to.be.true;
		expect(highlightCodeStub.calledOnce).to.be.true;
		expect(getGitBranchStub.calledOnce).to.be.true;
		expect(postMessageStub.calledWithMatch({
			type: 'populateCodeSnippet',
			value: {
				filePath: 'filePath',
				lineStart: 2,
				originalSnippet: 'originalSnippet',
				gitBranch: 'gitBranch',
			},
		})).to.be.true;
	});

	test('should not populate code snippet in the sidebar if there is no active text editor', async () => {
		activeTextEditorStub.get(() => undefined);

		await addCodeSnippet(sidebarProvider);

		expect(getActiveEditorRelativeFilePathStub.called).to.be.false;
		expect(getTextStub.called).to.be.false;
		expect(highlightCodeStub.called).to.be.false;
		expect(getGitBranchStub.called).to.be.false;
		expect(postMessageStub.called).to.be.false;
	});
});