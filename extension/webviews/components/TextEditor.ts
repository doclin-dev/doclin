import Quill from 'quill';
import { QuillSnippetBlot } from './QuillSnippetBlot';
import type { TextEditorInsertSnippet, User } from '../types';
import "quill-mention";
import { activeTextEditor } from '../state/store';
import type { ActiveTextEditor } from '../enums';

Quill.register({
    'formats/snippet': QuillSnippetBlot,
});

const Delta = Quill.import('delta');

export class TextEditor {
    private quillInstance: any;
    
    constructor(selector: string, suggestedUsersList: User[]=[], customOptions?: object) {
        const defaultOptions: object = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'link', 'code-block', { list: 'ordered' }, { list: 'bullet' }, { color: [] }]
                ],
                mention: {
                    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                    mentionDenotationChars: ["@"],
                    source: function(searchTerm: string, renderList: any, mentionChar:string) {
                    
                        const values = suggestedUsersList.map(({id, name})=> {
                            return {id: id, value: name};
                        })

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
    };

    setActiveEditor(activeEditor: ActiveTextEditor): void {
        this.quillInstance.container.addEventListener('mousedown', () => {
            activeTextEditor.set(activeEditor);
        });
    };

    getContents(): any {
        return JSON.stringify(this.quillInstance.getContents());
    }

    setContents(delta: any): void {
        this.quillInstance.setContents(this.parseJSON(delta));
    };

    setText(text: string): void {
        this.quillInstance.setText(text);
    }

    getStructuredText(): { delta: any, message: string, snippets: any, mentionedUserIds: number[] } {
        const delta = this.quillInstance.getContents();

        const {sanitizedDelta, mentionedUserIds} = this.sanitizeMentionDelta(delta);
        const { newDelta, snippets } = this.seperateSnippetBlotsFromDelta(sanitizedDelta);

        const message = this.getHtmlFromDelta(newDelta);

        return { delta: sanitizedDelta, message, snippets, mentionedUserIds};
    }

    private sanitizeMentionDelta(delta:any) {
        const mentionedUserIds: any[] = [];
        const sanitizedDelta = delta.map((op:any)=>{
            const mention = op.insert?.mention;
            if (mention) {
                const mentionedUserId = mention.id;
                mentionedUserIds.push(mentionedUserId);
                return {insert: {mention : JSON.parse(JSON.stringify(mention))}};
            } 
            return op;
        })
      
        return {sanitizedDelta, mentionedUserIds};
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

    private parseJSON(data: any) {
        try {
            if (typeof data === 'string') {
                return JSON.parse(data);
            } else if (typeof data === 'object') {
                return JSON.parse(JSON.stringify(data));
            } else {
                throw new Error('Invalid data type. Expected string or object.');
            }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          return null;
        }
      }
}