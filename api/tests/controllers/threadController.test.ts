import { expect } from 'chai';
import sinon, { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { postThread } from '../../src/controllers/threadController';
import { Thread } from '../../src/database/entities/Thread';
import { ThreadSnippet } from '../../src/database/entities/ThreadSnippet';
import { sendMentionEmailNotification } from '../../src/controllers/emailNotificationController';
import { suite, test, setup, teardown } from 'mocha';

class MockThread extends Thread {
  id: number;
  createdAt: Date;
  title: string;
  message: string;

  constructor(id: number, createdAt: Date, title: string, message: string) {
    super();
    this.id = id;
    this.createdAt = createdAt;
    this.title = title;
    this.message = message;
  }

  save = sinon.stub().resolves(this);

  static create = sinon.stub().callsFake((data: Partial<Thread>) => {
    return new MockThread(
      data.id || 1,
      data.createdAt || new Date(),
      data.title || 'Default Title',
      data.message || 'Default Message'
    );
  });
}

class MockThreadSnippet extends ThreadSnippet {
  save = sinon.stub().resolves(this);
  static create = sinon.stub().returns(new MockThreadSnippet());
  id = 1;
}

suite('Testing postThread', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let sandbox: SinonSandbox;
  let DOMPurify: any;
  let sendMentionEmailStub: SinonStub<[number, number[], number, string], Promise<void>>;

  setup(() => {
    sandbox = createSandbox();

    req = {
      body: {
        title: 'Test Title',
        threadMessage: 'Test Message',
        filePath: '/path/to/file',
        gitBranch: 'main',
        snippets: [],
        delta: {},
        projectId: 1,
        anonymous: false,
        mentionedUserIds: [],
      },
      userId: 1,
    };

    res = {
      send: sandbox.spy(),
    };

    const window = new JSDOM('').window;
    DOMPurify = createDOMPurify(window);

    sandbox.stub(DOMPurify, 'sanitize').callsFake((input: unknown) => input as string);
    sandbox.stub(Thread, 'create').callsFake(MockThread.create);
    sandbox.stub(ThreadSnippet, 'create').callsFake(MockThreadSnippet.create);
    sendMentionEmailStub = sandbox.stub(sendMentionEmailNotification as any);
  });

  teardown(() => {
    sandbox.restore();
  });

  test('should create a thread and send response', async () => {
    await postThread(req as Request, res as Response);

    expect((Thread.create as SinonStub).calledOnce).to.be.true;
    expect((res.send as SinonStub).calledOnce).to.be.true;
    expect((res.send as SinonStub).firstCall.args[0]).to.have.property('thread');
  });

  test('should send mention email notification if mentionedUserIds is not empty', async () => {
    req.body.mentionedUserIds = [2, 3];

    await postThread(req as Request, res as Response);

    expect(sendMentionEmailStub.calledOnce).to.be.true;
  });

  test('should not send mention email notification if mentionedUserIds is empty', async () => {
    req.body.mentionedUserIds = [];

    await postThread(req as Request, res as Response);

    expect(sendMentionEmailStub.called).to.be.false;
  });
});
