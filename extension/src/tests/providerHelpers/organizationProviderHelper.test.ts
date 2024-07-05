import * as organizationProviderHelper from '../../providerHelpers/organizationProviderHelper';
import * as writeDoclinFile from '../../providerHelpers/doclinFile/writeDoclinFile';
import * as readDoclinFile from '../../providerHelpers/doclinFile/readDoclinFile';
import { SinonStub, createSandbox } from 'sinon';
import { expect } from 'chai';

suite('storeOrganizationId', () => {
  let sandbox: sinon.SinonSandbox;
  let readDoclinFileStub: SinonStub;
  let writeDoclinFileStub: SinonStub;

  setup(() => {
    sandbox = createSandbox();

    // Stub the readDoclinFile and writeDoclinFile methods
    readDoclinFileStub = sandbox.stub(readDoclinFile, 'readDoclinFile');
    writeDoclinFileStub = sandbox.stub(writeDoclinFile, 'writeDoclinFile');
  });

  teardown(() => {
    sandbox.restore();
  });

  test('should store organizationId in DoclinFile', async () => {
    const mockOrganizationId = '123';
    const mockDoclinFile = { organizationId: '' };
    readDoclinFileStub.resolves(mockDoclinFile);

    await organizationProviderHelper.storeOrganizationId(mockOrganizationId);

    expect(readDoclinFileStub.calledOnce).to.be.true;
    expect(writeDoclinFileStub.calledOnce).to.be.true;
    expect(writeDoclinFileStub.calledWith({ organizationId: mockOrganizationId })).to.be.true;
  });
});
