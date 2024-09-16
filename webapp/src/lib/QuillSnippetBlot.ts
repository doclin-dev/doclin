import Quill from 'quill';
import type { TextEditorInsertSnippet } from '../types/TextEditorInsertSnippet';

const BlockEmbed = Quill.import('blots/block/embed');

export class QuillSnippetBlot extends BlockEmbed {
  static create({ displaySnippet, filePath, lineStart, originalSnippet, gitBranch }: TextEditorInsertSnippet) {
    let node = super.create();
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-filepath', filePath);
    node.setAttribute('data-linestart', lineStart);
    node.setAttribute('data-originalsnippet', originalSnippet);
    node.setAttribute('data-gitbranch', gitBranch);
    node.innerHTML = displaySnippet;
    node.classList.add('ql-syntax');
    return node;
  }

  static value(node: any) {
    return {
      displaySnippet: node.innerHTML,
      filePath: node.getAttribute('data-filepath'),
      lineStart: node.getAttribute('data-linestart'),
      originalSnippet: node.getAttribute('data-originalsnippet'),
      gitBranch: node.getAttribute('data-gitbranch'),
    };
  }
}

QuillSnippetBlot.blotName = 'snippetblot';
QuillSnippetBlot.tagName = 'pre';
