<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User } from "../types";
    import Quill from "quill";
    import Thread from './Thread.svelte';
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import { Page } from "../enums";
  import { WebviewStateManager } from "../WebviewStateManager";

    export let user: User;
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
                },
            });
        let { thread }: {thread: Thread} = await response.json();
        console.log(thread);
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
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_MESSAGE, threadMessage);
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
            WebviewStateManager.setState(WebviewStateManager.type.THREAD_MESSAGE, threadMessage);
        });
        
        quillEditor.root.innerHTML = threadMessage;
    }

    async function loadThreads() {
        tsvscode.postMessage({ type: 'getThreadsByActiveFilePath', value: undefined });
    }

    function chooseAnotherProject() {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, null);
        page = Page.InitializeProject;
    }

    onMount(async () => {
        threadMessage = WebviewStateManager.getState(WebviewStateManager.type.THREAD_MESSAGE) || "";
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populate-thread-message":
                    populateThreadMessageField(message.value);
                    break;
                case "getThreadsByActiveFilePath":
                    threads = message.value;
                    console.log(threads);
                    break;
            }
        });

        loadThreads();

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


<ViewerTopBar username={user.name} projectName={currentProject?.name}/>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#each threads as thread (thread.id)}
        <Thread thread={thread} username={user.name} bind:page={page} reloadThreads={loadThreads}/>
    {/each}
</div>

<button on:click={() => {chooseAnotherProject()}}>Project: {currentProject?.name}</button>