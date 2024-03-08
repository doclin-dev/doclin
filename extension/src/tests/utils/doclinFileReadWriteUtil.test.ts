import * as vscode from 'vscode';
import { expect } from 'chai';
import { createSandbox, SinonSandbox, stub } from 'sinon';
import { readDoclinFile } from '../../providerHelpers/readDoclinFile';
import { DoclinFile } from '../../types';
import { describe, it, beforeEach, afterEach } from 'mocha';

describe('Testing readDoclinFile', () => {
	let sandbox: SinonSandbox;

	const fakeFs: any = {};
	stub(vscode.workspace, 'fs').value(fakeFs);

	beforeEach(() => {
		sandbox = createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should read the doclin file', async () => {
		const fileContent = '{"organizationId":"test-org","projectId":69}';
        
		// Stub the `readFile` method of `vscode.workspace.fs`
		fakeFs.readFile = stub().returns(new Promise<Uint8Array>((resolve) => {
			resolve(Buffer.from(fileContent, 'utf-8'));
		}));

		const doclinFile: DoclinFile = await readDoclinFile();
		
		console.log("printing doclin file", doclinFile);
	});
});