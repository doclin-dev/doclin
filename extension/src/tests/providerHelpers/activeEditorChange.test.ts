import 'mocha';
import * as vscode from 'vscode';
import { SinonStub, createSandbox } from 'sinon';
import { expect } from 'chai';
import { handleActiveTextEditorChange } from '../../providerHelpers/activeEditorChange';
import * as sidebarProviderUtil from '../../utils/sidebarProviderUtil';

suite('handleActiveTextEditorChange', () => {
	let sandbox: sinon.SinonSandbox;
	let mockWebviewView: vscode.WebviewView;
	let onDidChangeActiveTextEditorStub: SinonStub;
	let isDoclinProjectChangedStub: SinonStub;
	let postMessagePromise: Promise<any>;
	let visibleStub: SinonStub;

	setup(() => {
		sandbox = createSandbox();
		onDidChangeActiveTextEditorStub = sandbox.stub(vscode.window, 'onDidChangeActiveTextEditor');
		isDoclinProjectChangedStub = sandbox.stub(sidebarProviderUtil, 'isDoclinProjectChanged');
		visibleStub = sandbox.stub();

		mockWebviewView = {
			webview: {
				postMessage: sandbox.stub(),
				asWebviewUri: sandbox.stub(),
				cspSource: ''
			},
			visible: visibleStub
		} as unknown as vscode.WebviewView;

		postMessagePromise = new Promise(resolve => {
			(mockWebviewView.webview.postMessage as SinonStub).callsFake(() => {
				  resolve(null);
			});
		});
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should post message to webview when active editor is changed to different doclin project', async () => {
		isDoclinProjectChangedStub.resolves(true);
		visibleStub.returns(true);
	  
		handleActiveTextEditorChange(mockWebviewView);
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
		await postMessagePromise;
	  
		expect((mockWebviewView.webview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledWithMatch({ type: 'getExtensionState' })).to.be.true;
	});

	test('should post message to webview when active editor is changed in same doclin project', async () => {
		isDoclinProjectChangedStub.resolves(false);
		visibleStub.returns(true);
	  
		handleActiveTextEditorChange(mockWebviewView);
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
		await postMessagePromise;
	  
		expect((mockWebviewView.webview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledWithMatch({ type: 'switchActiveEditor' })).to.be.true;
	});
});