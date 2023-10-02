import hljs from 'highlight.js';

hljs.configure({
    languages: ['javascript', 'ruby', 'python', 'cpp']
});

import Quill from 'quill';
import { WebviewStateManager } from '../WebviewStateManager';

export class TextEditor {
    private quillInstance: any;
    
    constructor(selector: string, customOptions?: object) {
        const defaultOptions: object = {
            modules: {
               syntax: {
                    highlight: (text:string) => {
                      return hljs.highlightAuto(text).value;
                    },
                  },
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'blockquote', 'code-block', 'image'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ color: [] }, { background: [] }]
                ]
            },
            theme: 'snow'
        };
        
        const options = { ...defaultOptions, ...customOptions };
        this.quillInstance = new Quill(selector, options);
        
        // Customize toolbar container style
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

    setText(text:string): void {
        this.quillInstance.root.innerHTML = text;
    };

    getText():string {
        return this.quillInstance.root.innerHTML;
    };

    getContents():void{
        return this.quillInstance.getContents();
    };

    onTextChange(callback: () => void): void {
        this.quillInstance.on('text-change', callback);
    };

    removeToolbarTheme(): void {
        this.quillInstance.theme.modules.toolbar.container.style.display = 'none';
    };

    insertCodeSnippet({ filePath, threadMessage }: { filePath: string, threadMessage: string }): void {
        const editor = this.quillInstance;
        const selection = editor.getSelection(true);
        const cursorPosition: number = selection ? selection.index : editor.getLength();
        const textToInsert = `File Path: ${filePath}\n${threadMessage}\n`;
        editor.insertText(cursorPosition, "\n");
        editor.insertText(cursorPosition + 1, textToInsert);
        editor.formatText(cursorPosition + 1, textToInsert.length, "code-block", true);
        editor.insertText(cursorPosition + 1 + textToInsert.length, "\n");
        editor.setSelection(cursorPosition + 1 + textToInsert.length);
    };
    
}