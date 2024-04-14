import { SinonStub, createSandbox } from 'sinon';
import { expect } from 'chai';
import * as projectProviderHelper from '../../providerHelpers/projectProviderHelper';
import * as writeDoclinFile from '../../providerHelpers/doclinFile/writeDoclinFile';
import * as readDoclinFile from '../../providerHelpers/doclinFile/readDoclinFile';

suite('storeProjectId', () => {
	let sandbox = createSandbox();
	let readDoclinFileStub: SinonStub;
	let writeDoclinFileStub: SinonStub;

	setup(() => {
		readDoclinFileStub = sandbox.stub(readDoclinFile, 'readDoclinFile');
		writeDoclinFileStub = sandbox.stub(writeDoclinFile, 'writeDoclinFile');
	});

	teardown(() => {
		sandbox.restore();
	});

	test('should store projectId in DoclinFile', async () => {
		const mockProjectId = 123;
		const mockDoclinFile = { projectId: 0 };
		readDoclinFileStub.resolves(mockDoclinFile);

		await projectProviderHelper.storeProjectId(mockProjectId);

		expect(readDoclinFileStub.calledOnce).to.be.true;
		expect(writeDoclinFileStub.calledOnce).to.be.true;
		expect(writeDoclinFileStub.calledWith({ projectId: mockProjectId })).to.be.true;
	});
});