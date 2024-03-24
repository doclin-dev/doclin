import 'mocha';
import * as vscode from 'vscode';
import { SinonStub, createSandbox } from 'sinon';
import { expect } from 'chai';
import { handleActiveTextEditorChange } from '../../providerHelpers/activeEditorChange';
import * as sidebarProviderUtil from '../../utils/sidebarProviderUtil';

suite('handleActiveTextEditorChange', () => {
	let sandbox: sinon.SinonSandbox;
	let mockWebview: vscode.Webview;
	let onDidChangeActiveTextEditorStub: SinonStub;
	let isDoclinProjectChangedStub: SinonStub;
	let postMessagePromise: Promise<any>;

	setup(() => {
		sandbox = createSandbox();

		mockWebview = {
			postMessage: sandbox.stub(),
			asWebviewUri: sandbox.stub(),
			cspSource: '',
		} as unknown as vscode.Webview;

		postMessagePromise = new Promise(resolve => {
			(mockWebview.postMessage as SinonStub).callsFake(() => {
				  resolve(null);
			});
		});

		onDidChangeActiveTextEditorStub = sandbox.stub(vscode.window, 'onDidChangeActiveTextEditor');
		isDoclinProjectChangedStub = sandbox.stub(sidebarProviderUtil, 'isDoclinProjectChanged');
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should post message to webview when active editor changes if doclin project is changed', async () => {
		isDoclinProjectChangedStub.resolves(true);
	  
		handleActiveTextEditorChange(mockWebview);
	  
		onDidChangeActiveTextEditorStub.callArgWith(0, {});

		await postMessagePromise;
	  
		expect((mockWebview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebview.postMessage as SinonStub).calledWithMatch({ type: 'getExtensionState' })).to.be.true;
	});

	test('should post message to webview when active editor changes if doclin project is not changed', async () => {
		isDoclinProjectChangedStub.resolves(false);
	  
		handleActiveTextEditorChange(mockWebview);
	  
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
	  
		await postMessagePromise;
	  
		expect((mockWebview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebview.postMessage as SinonStub).calledWithMatch({ type: 'switchActiveEditor' })).to.be.true;
	});
});