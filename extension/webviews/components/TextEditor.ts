import Quill from 'quill';
import { WebviewStateManager } from '../WebviewStateManager';
import { QuillSnippetBlot } from './QuillSnippetBlot';
import type { TextEditorInsertSnippet } from '../types';
import "quill-mention";

Quill.register({
    'formats/snippet': QuillSnippetBlot,
});

const Delta = Quill.import('delta');

const atValues = [
    { id: 1, value: "Fredrik Sundqvist" },
    { id: 2, value: "Patrik Sjölin" },
    { id: 3, value: 'Shawon'},
    { id: 4, value: "Prottooy"},
  ];
const hashValues = [
    { id: 3, value: "Fredrik Sundqvist 2" },
    { id: 4, value: "Patrik Sjölin 2" }
];

export class TextEditor {
    private quillInstance: any;
    
    constructor(selector: string, customOptions?: object) {
        const defaultOptions: object = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'link', 'code-block', { list: 'ordered' }, { list: 'bullet' }, { color: [] }]
                ],
                mention: {
                    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                    mentionDenotationChars: ["@", "#"],
                    source: function(searchTerm: string, renderList: any, mentionChar:string) {
                      let values;
              
                      if (mentionChar === "@") {
                        values = atValues;
                      } else {
                        values = hashValues;
                      }
              
                      if (searchTerm.length === 0) {
                        renderList(values, searchTerm);
                      } else {
                        const matches = [];
                        for (let i = 0; i < values.length; i++)
                          if (
                            ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
                          )
                            matches.push(values[i]);
                        renderList(matches, searchTerm);
                      }
                    },
                }
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
        this.quillInstance.setContents(delta);
    };

    setText(text: string): void {
        this.quillInstance.setText(text);
    }

    getStructuredText(): { delta: any, threadMessage: string, snippets: any } {
        const delta = this.quillInstance.getContents();

        const { newDelta, snippets } = this.seperateSnippetBlotsFromDelta(delta);

        const threadMessage = this.getHtmlFromDelta(newDelta);

        return { delta, threadMessage, snippets};
    }

    private seperateSnippetBlotsFromDelta(delta: any) {
        const snippets: any[] = [];
        let count = 0;

        const newDelta = delta.map((op: any) => {
            const snippetblot = op.insert?.snippetblot;

            if (snippetblot) {
                snippetblot['index'] = count;
                snippets.push(snippetblot);
                return { insert: this.getSnippetTag(count++) };
            }

            return op;
        });

        return { newDelta, snippets }
    }

    private getSnippetTag(index: number) {
        return `[snippet_${index}]`;
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

    insertCodeSnippet({ filePath, lineStart, displaySnippet, originalSnippet }: TextEditorInsertSnippet): void {
        const editor = this.quillInstance;
        const selection = editor.getSelection(true);
        const cursorPosition: number = selection ? selection.index : editor.getLength();

        editor.updateContents(new Delta()
            .retain(cursorPosition)
            .insert(
                { 
                    snippetblot: { 
                        displaySnippet, 
                        filePath, 
                        lineStart, 
                        originalSnippet 
                    }
                }, 
                { 
                    'formats/snippet': true 
                }
            )
        );
    };
}