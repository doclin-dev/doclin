"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const readDoclinFile_1 = require("../../providerHelpers/doclinFile/readDoclinFile");
const mocha_1 = require("mocha");
const doclinFileReadWriteUtil = require("../../utils/doclinFileReadWriteUtil");
const path = require("path");
(0, mocha_1.describe)('Testing readDoclinFile', () => {
    (0, mocha_1.it)('should read the doclin file from the existing doclin file path', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFilePath = path.resolve(__dirname, '../../testAssets/.doclinTest');
        const mockedDoclinFileUri = vscode.Uri.file(mockFilePath);
        const getExistingDoclinFilePathStub = (0, sinon_1.stub)(doclinFileReadWriteUtil, 'getExistingDoclinFilePath').resolves(mockedDoclinFileUri);
        const doclinFile = yield (0, readDoclinFile_1.readDoclinFile)();
        // expect(getExistingDoclinFilePathStub.calledOnce).to.be.true;
        (0, chai_1.expect)(doclinFile.organizationId).to.equal('test-org-id');
        // expect(doclinFile.projectId).to.equal(5);
        console.log("Doclin File", doclinFile);
    }));
});
//# sourceMappingURL=readDoclinFile.test.js.map