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
    let threads: Array<{ message: string; id: number }> = [];
    let currentProject: Project | null;
    let currentFilePath: string | null;

    async function postThreadMessage(t: string) {
        const response = await fetch(`${apiBaseUrl}/threads`, {
                method: "POST",
                body: JSON.stringify({
                    message: t,
                    projectId: currentProject?.id,
                    filePath: currentFilePath
                }),
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
            });
        const { thread } = await response.json();
        threads = [thread, ...threads];
    }

    async function populateThreadMessageField(message: string) {
        const selection = quillEditor.getSelection();
        const cursorPosition: number = selection ? selection.index : quillEditor.getLength();

        // Insert a line break to move the cursor to the next line
        quillEditor.insertText(cursorPosition, "\n");
        quillEditor.setSelection(cursorPosition + 1);

        const range = quillEditor.getSelection(true);
        quillEditor.formatText(range.index, message.length + 1, "code-block", true);

        // Insert the new message at the cursor position
        quillEditor.insertText(cursorPosition + 1, message);

        // remove codeblock from filepath (1st line)
        quillEditor.formatLine(range.index, 1, "code-block", false);

        // Move the cursor to the end of the new message
        quillEditor.setSelection(cursorPosition + 1 + message.length);
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
        }
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