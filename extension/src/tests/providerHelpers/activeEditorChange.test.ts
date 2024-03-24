import 'mocha';
import * as vscode from 'vscode';
import { SinonStub, createSandbox } from 'sinon';
import { expect } from 'chai';
import { handleActiveTextEditorChange } from '../../providerHelpers/activeEditorChange';
import * as sidebarProviderUtil from '../../utils/sidebarProviderUtil';

suite('handleActiveTextEditorChange', () => {
	let sandbox: sinon.SinonSandbox;
	let onDidChangeActiveTextEditorStub: SinonStub;
	let isDoclinProjectChangedStub: SinonStub;

	setup(() => {
		sandbox = createSandbox();
		onDidChangeActiveTextEditorStub = sandbox.stub(vscode.window, 'onDidChangeActiveTextEditor');
		isDoclinProjectChangedStub = sandbox.stub(sidebarProviderUtil, 'isDoclinProjectChanged');
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should post message to webview when active editor is changed to different doclin project', async () => {
		isDoclinProjectChangedStub.resolves(true);

		const mockWebviewView = {
			webview: {
				postMessage: sandbox.stub(),
				asWebviewUri: sandbox.stub(),
				cspSource: ''
			},
			visible: true
		} as unknown as vscode.WebviewView;

		const postMessagePromise = new Promise(resolve => {
			(mockWebviewView.webview.postMessage as SinonStub).callsFake(() => {
				  resolve(null);
			});
		});
	  
		handleActiveTextEditorChange(mockWebviewView);
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
		await postMessagePromise;
	  
		expect(isDoclinProjectChangedStub.called).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledWithMatch({ type: 'getExtensionState' })).to.be.true;
	});

	test('should post message to webview when active editor is changed in same doclin project', async () => {
		isDoclinProjectChangedStub.resolves(false);

		const mockWebviewView = {
			webview: {
				postMessage: sandbox.stub(),
				asWebviewUri: sandbox.stub(),
				cspSource: ''
			},
			visible: true
		} as unknown as vscode.WebviewView;

		const postMessagePromise =  new Promise(resolve => {
			(mockWebviewView.webview.postMessage as SinonStub).callsFake(() => {
				  resolve(null);
			});
		});
	  
		handleActiveTextEditorChange(mockWebviewView);
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
		await postMessagePromise;
	  
		expect(isDoclinProjectChangedStub.called).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledOnce).to.be.true;
		expect((mockWebviewView.webview.postMessage as SinonStub).calledWithMatch({ type: 'switchActiveEditor' })).to.be.true;
	});

	test('should not post message to webview when doclin sidebar is not visible', async () => {
		const mockWebviewView = {
			webview: {
				postMessage: sandbox.stub(),
				asWebviewUri: sandbox.stub(),
				cspSource: ''
			},
			visible: false
		} as unknown as vscode.WebviewView;
	  
		handleActiveTextEditorChange(mockWebviewView);
		onDidChangeActiveTextEditorStub.callArgWith(0, {});
	  
		expect(isDoclinProjectChangedStub.called).to.be.false;
	});
});