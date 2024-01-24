import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

export class QuillSnippetBlot extends BlockEmbed {
    static create({ displaySnippet, filePath, lineStart, originalSnippet }: { displaySnippet: string, filePath: string, lineStart: number, originalSnippet: string }) {
        let node = super.create();
        node.setAttribute('contenteditable', 'false');
        node.setAttribute('data-filepath', filePath);
        node.setAttribute('data-linestart', lineStart);
        node.setAttribute('data-originalsnippet', originalSnippet);
        node.innerHTML = displaySnippet;
        node.classList.add('ql-syntax');
        return node;
    }

    static value(node: any) {
        return {
            'displaySnippet': node.innerHTML,
            'filePath': node.getAttribute('data-filepath'),
            'lineStart': node.getAttribute('data-linestart'),
            'originalSnippet': node.getAttribute('data-originalsnippet'),
        };
    }
}

QuillSnippetBlot.blotName = 'snippetblot';
QuillSnippetBlot.tagName = 'pre';