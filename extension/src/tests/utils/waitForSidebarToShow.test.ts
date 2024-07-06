import { stub, SinonStub } from 'sinon';
import { expect } from 'chai';
import { waitForSidebarStatus, handleGetSidebarLoadingStatus } from '../../utils/waitForSidebarToShow';
import { SidebarLoadingStatus } from '../../enums';
import * as vscode from 'vscode';

suite('waitForSidebarStatus', function () {
  let webview: vscode.Webview;

  setup(function () {
    webview = { postMessage: stub() } as unknown as vscode.Webview;
  });

  test('should resolve when sidebarLoadingStatus is greater than or equal to targetLoadingStatus LOADING', function (done) {
    const promise = waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING);
    handleGetSidebarLoadingStatus(SidebarLoadingStatus.LOADING);

    setImmediate(() => {
      expect(
        (webview.postMessage as SinonStub).calledWith({
          type: 'getSidebarLoadingStatus',
        })
      ).to.be.true;
      promise.then(() => done(), done);
    });
  });

  test('should resolve when sidebarLoadingStatus is greater than or equal to targetLoadingStatus LOADING_COMPLETE', function (done) {
    const promise = waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING_COMPLETE);
    handleGetSidebarLoadingStatus(SidebarLoadingStatus.LOADING_COMPLETE);

    setImmediate(() => {
      expect(
        (webview.postMessage as SinonStub).calledWith({
          type: 'getSidebarLoadingStatus',
        })
      ).to.be.true;
      promise.then(() => done(), done);
    });
  });

  test('should reject when the timeout is reached', function (done) {
    const promise = waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING_COMPLETE);
    handleGetSidebarLoadingStatus(SidebarLoadingStatus.UNMOUNTED);

    setImmediate(() => {
      expect(
        (webview.postMessage as SinonStub).calledWith({
          type: 'getSidebarLoadingStatus',
        })
      ).to.be.true;
      promise.then(
        () => done(new Error('Promise should not resolve')),
        (err: Error) => {
          expect(err.message).to.equal('Please open doclin sidebar to add a comment');
          done();
        }
      );
    });
  });
});
