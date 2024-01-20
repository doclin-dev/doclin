import Quill from 'quill';
import { WebviewStateManager } from '../WebviewStateManager';
import { QuillSnippetBlot } from './QuillSnippetBlot';

Quill.register({
    'formats/snippet': QuillSnippetBlot,
});

const Delta = Quill.import('delta');

export class TextEditor {
    private quillInstance: any;
    
    constructor(selector: string, customOptions?: object) {
        const defaultOptions: object = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'link', 'code-block', { list: 'ordered' }, { list: 'bullet' }, { color: [] }]
                ]
            },
            theme: 'snow'
        };
        
        const options = { ...defaultOptions, ...customOptions };
        
        this.quillInstance = new Quill(selector, options);
        
        if (this.quillInstance.theme && this.quillInstance.theme.modules.toolbar) {
            this.quillInstance.theme.modules.toolbar.container.style.background = '#f1f1f1';
            this.quillInstance.theme.modules.toolbar.container.style.border = 'none';
        }
    };

    setActiveEditor(activeEditor: Number): void {
        this.quillInstance.container.addEventListener('mousedown', () => {
            WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, activeEditor);
        });
    };

    getContents(): any {
        return JSON.stringify(this.quillInstance.getContents());
    }

    setContents(delta: any): void {
        console.log(delta)
        this.quillInstance.setContents(JSON.parse(delta));
        console.log(this.quillInstance.getContents());
    };

    setText(text: string): void {
        this.quillInstance.setText(text);
    }

    getStructuredText(): {threadMessage: string, snippets: any} {
        const delta = this.quillInstance.getContents();
        const snippets: any[] = [];

        const newDelta = delta.map((op: any) => {
            const snippetblot = op.insert?.snippetblot;
            if (snippetblot) {
                snippets.push(snippetblot);
                return { insert: "[snippet]" };
            }

            return op;
        });

        const threadMessage = this.getHtmlFromDelta(newDelta);

        return { threadMessage, snippets};
    }

    private getHtmlFromDelta(delta: any): string {
        const newQuill = new Quill(document.createElement('div'));
        newQuill.setContents(delta);
        return newQuill.root.innerHTML;
    }

    onTextChange(callback: () => void): void {
        this.quillInstance.on('text-change', callback);
    };

    removeToolbarTheme(): void {
        this.quillInstance.theme.modules.toolbar.container.style.display = 'none';
    };

    insertCodeSnippet({ filePath, lineStart, displaySnippet, originalSnippet }: { filePath: string, lineStart: number, displaySnippet: string, originalSnippet: string }): void {
        const editor = this.quillInstance;
        const selection = editor.getSelection(true);
        const cursorPosition: number = selection ? selection.index : editor.getLength();

        editor.updateContents(new Delta()
            .retain(cursorPosition)
            .insert(
                { snippetblot: { displaySnippet, filePath, lineStart, originalSnippet } }, 
                { 'formats/snippet': true }
            )
        );
    };
}