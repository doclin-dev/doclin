import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonStub, stub, replace } from 'sinon';
import { readDoclinFile } from '../../providerHelpers/doclinFile/readDoclinFile';
import { DoclinFile } from '../../types';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as doclinFileReadWriteUtil from '../../utils/doclinFileReadWriteUtil';
import * as path from 'path';

describe('Testing readDoclinFile', () => {
	let getExistingDoclinFilePathStub: SinonStub;

	beforeEach(() => {
		getExistingDoclinFilePathStub = stub(doclinFileReadWriteUtil, 'getExistingDoclinFilePath');
	});

	afterEach(() => {
		getExistingDoclinFilePathStub.restore();
	});

	it('should return DoclinFile from the existing doclin file path', async () => {
		const mockFilePath = path.resolve(__dirname, '../../../testAssets/.doclinTest');
		const mockDoclinFileUri = vscode.Uri.file(mockFilePath);
		getExistingDoclinFilePathStub.resolves(mockDoclinFileUri);

		const doclinFile: DoclinFile = await readDoclinFile();

		expect(getExistingDoclinFilePathStub.calledOnce).to.be.true;
		expect(doclinFile.organizationId).to.equal('test-org-id');
		expect(doclinFile.projectId).to.equal(5);
	});

	it('should return empty DoclinFile when doclin file does not exist', async () => {
		getExistingDoclinFilePathStub.resolves(null);

		const doclinFile: DoclinFile = await readDoclinFile();

		expect(getExistingDoclinFilePathStub.calledOnce).to.be.true;
		expect(doclinFile.organizationId).to.be.null;
		expect(doclinFile.projectId).to.be.null;
	});
});