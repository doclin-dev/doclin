import * as vscode from 'vscode';
import { expect } from 'chai';
import { SinonStub, stub, replace, match } from 'sinon';
import { writeDoclinFile } from '../../../providerHelpers/doclinFile/writeDoclinFile';
import { DoclinFile } from '../../../types';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as doclinFileReadWriteUtil from '../../../utils/doclinFileReadWriteUtil';
import * as fileSystemUtil from '../../../utils/fileSystemUtil';
import * as path from 'path';

const DOCLIN_FILE: DoclinFile = {
	organizationId: "test-org-id",
	projectId: 69
};

describe('Testing writeDoclinFile', () => {
	const writeToFilePathStub: SinonStub = stub(fileSystemUtil, 'writeToFilePath').resolves();
	let getExistingDoclinFilePathStub: SinonStub;

	beforeEach(() => {
		getExistingDoclinFilePathStub = stub(doclinFileReadWriteUtil, 'getExistingDoclinFilePath');
	});

	afterEach(() => {
		getExistingDoclinFilePathStub.restore();
		writeToFilePathStub.restore();
	});

	it('should write to existing doclin file if it exists', async () => {
		const mockFilePath = path.resolve(__dirname, '../../../../testAssets/.doclinTest');
		const mockDoclinFileUri = vscode.Uri.file(mockFilePath);
		getExistingDoclinFilePathStub.resolves(mockDoclinFileUri);

		await writeDoclinFile(DOCLIN_FILE);

		expect(writeToFilePathStub.calledOnce).to.be.true;
		expect(writeToFilePathStub.calledWith(mockFilePath, match.any));
	});
});