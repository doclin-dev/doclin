<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User } from "../types";
    import Quill from "quill";

    export let user: User;
    export let accessToken: string;
    
    let quillEditor: any;
    let threadMessage: string;
    let threads: Array<{ message: string; id: number }> = [];
    let currentProject: Project;

    async function postThreadMessage(t: string) {
        const response = await fetch(`${apiBaseUrl}/threads`, {
                method: "POST",
                body: JSON.stringify({
                    message: t,
                    projectId: currentProject.id
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

        // Move the cursor to the end of the new line
        quillEditor.setSelection(cursorPosition + 1);

        // Apply code-block formatting to the incoming message
        const range = quillEditor.getSelection(true);
        quillEditor.formatLine(range.index, message.length + 1, "code-block", true);

        // Insert the new message at the cursor position
        quillEditor.insertText(cursorPosition + 1, message);

        // Move the cursor to the end of the new message
        quillEditor.setSelection(cursorPosition + 1 + message.length);
        threadMessage = quillEditor.root.innerHTML;
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    async function submitThreadMessage() {
        threadMessage = quillEditor.root.innerHTML;
        postThreadMessage(threadMessage);
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
            threadMessage = quillEditor.getText();
            tsvscode.setState({...tsvscode.getState(), threadMessage});
        });
        
        quillEditor.root.innerHTML = threadMessage;
    }

    async function loadThreads() {
        const response = await fetch(`${apiBaseUrl}/threads?projectId=${currentProject.id}`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        threads = payload.threads;
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
            }
        });

        initializeQuillEditor();
        loadThreads();
    });
</script>

<style>
    #textEditor{
        width: 100%;
        height: 150px;
        resize: both; 
        overflow: auto;
    }

    .threadContainer{
        background-color: rgb(46, 48, 48);
        padding: 0.5rem;
        gap: 0.25;
        border-radius: 5px;
        border: 2px;
        margin-bottom: 0.5rem;
    }
    .editContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    #editButton {
        width: 30px;
        
    }
</style>

<div>Hello: {user.name}</div>
<div>Project: {currentProject?.name}</div>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#each threads as thread (thread.id)}
    <div class='threadContainer'>
        <div class='editContainer'>
            {user.name}
            <button id='editButton'>Edit</button>
        </div>
        <div>
            {@html thread.message}
        </div> 
    </div>
    {/each}
</div>
