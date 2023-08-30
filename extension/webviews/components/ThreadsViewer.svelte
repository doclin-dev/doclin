<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User } from "../types";
    import Quill from "quill";
    import Thread from './Thread.svelte';
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import { Page } from "../enums";

    export let user: User;
    export let accessToken: string;
    export let page: Page;
    
    let quillEditor: any;
    let threadMessage: string;
    let threads: Array<Thread> = [];
    let currentProject: Project | null;
    let currentFilePath: string | null;

    async function postThreadMessage(t: string) {
        const response = await fetch(`${apiBaseUrl}/threads`, {
                method: "POST",
                body: JSON.stringify({
                    message: t,
                    projectId: currentProject?.id,
                    activeEditorFilePath: currentFilePath
                }),
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
            });
        let { thread }: {thread: Thread} = await response.json();
        console.log(thread);
        thread = loadSnippetInsideThread(thread);
        threads = [thread, ...threads];
    }

    async function populateThreadMessageField({filePath, threadMessage}: {filePath: string, threadMessage: string}) {
        const selection = quillEditor.getSelection(true);
        const cursorPosition: number = selection ? selection.index : quillEditor.getLength();
        const textToInsert = `File Path: ${filePath}\n${threadMessage}\n`;

        quillEditor.insertText(cursorPosition, "\n");
        quillEditor.insertText(cursorPosition + 1, textToInsert);
        quillEditor.formatText(cursorPosition + 1, textToInsert.length, "code-block", true);
        quillEditor.insertText(cursorPosition + 1 + textToInsert.length, "\n");
        quillEditor.setSelection(cursorPosition + 1 + textToInsert.length);
    }

    async function submitThreadMessage() {
        threadMessage = quillEditor.root.innerHTML;
        if (threadMessage) {
            postThreadMessage(threadMessage);
        }
        threadMessage = "";
        quillEditor.setText(threadMessage);
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    async function initializeQuillEditor() {
        quillEditor = new Quill('#textEditor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'blockquote', 'code-block', 'image'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ color: [] }, { background: [] }]
                ]
            },
            theme: 'snow'
        });   
        
        quillEditor.theme.modules.toolbar.container.style.background = '#f1f1f1';
        quillEditor.theme.modules.toolbar.container.style.border = 'none';

        quillEditor.on('text-change', () => {
            threadMessage = quillEditor.root.innerHTML;
            tsvscode.setState({...tsvscode.getState(), threadMessage});
        });
        
        quillEditor.root.innerHTML = threadMessage;
        console.log(threadMessage);
    }

    async function loadThreads() {
        if (currentProject) {
            const response = await fetch(`${apiBaseUrl}/threads?projectId=${currentProject.id}&filePath=${currentFilePath}`, {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });

            const payload = await response.json();
            threads = payload.threads;

            for (let thread of threads) {
                thread = loadSnippetInsideThread(thread);
            };
        }
    }

    function loadSnippetInsideThread(thread: Thread): Thread {
        const snippets = thread.__snippets__;
        
        for (const snippet of snippets) {
            const firstSnippetFilePath = snippet.__snippetFilePaths__[0];
            const codeBlock = `<pre class="ql-syntax" spellcheck="false">File Path: ${firstSnippetFilePath.filePath}<hr>${snippet.text}</pre>`;
            thread.message = thread.message.replace(getSnippetTag(snippet.id), codeBlock);
        }

        return thread;
    }

    function getSnippetTag (snippetId: number) {
        return `[snippet_${snippetId}]`;
    }

    function chooseAnotherProject() {
        tsvscode.setState({...tsvscode.getState(), currentProject: null});
        page = Page.InitializeProject;
    }

    onMount(async () => {
        threadMessage = tsvscode.getState()?.threadMessage || "";
        currentProject = tsvscode.getState()?.currentProject;

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populate-thread-message":
                    populateThreadMessageField(message.value);
                    break;
                case "getCurrentFilePath":
                    currentFilePath = message.value;
                    loadThreads();
                    break;
            }
        });

        tsvscode.postMessage({ type: 'getCurrentFilePath', value: undefined });

        initializeQuillEditor();
    });
</script>

<style>
    #textEditor{
        width: 100%;
        height: 150px;
        resize: both; 
        overflow: auto;
    }
</style>


<ViewerTopBar username={user.name}/>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#each threads as thread (thread.id)}
        <Thread thread={thread} username={user.name} bind:page={page} accessToken={accessToken} reloadThreads={loadThreads}/>
    {/each}
</div>

<button on:click={() => {chooseAnotherProject()}}>Project: {currentProject?.name}</button>