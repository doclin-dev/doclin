<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User } from "../types";
    import Quill from "quill";
    import Thread from './Thread.svelte';
    import ViewerTopBar from "./ViewerTopBar.svelte";

    export let user: User;
    export let accessToken: string;
    
    let quillEditor: any;
    let threadMessage = tsvscode.getState()?.threadMessage || "";
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
        console.log(message);

        // Apply code-block formatting to the incoming message
        const range = quillEditor.getSelection(true);
        quillEditor.formatLine(range.index, message.length + 1, "code-block", true);

        // Insert the new message at the cursor position
        quillEditor.insertText(cursorPosition + 1, message);

        // Move the cursor to the end of the new message
        quillEditor.setSelection(cursorPosition + 1 + message.length);
        threadMessage="";
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    function handleThreadMessageUpdate() {
        // threadMessage = quill.get;
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    async function submitThreadMessage() {
        threadMessage = quillEditor.root.innerHTML;
        postThreadMessage(threadMessage);
        threadMessage = "";
        quillEditor.setText(threadMessage);
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populate-thread-message":
                    populateThreadMessageField(message.value);
                    break;
            }
        })

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
        
        currentProject = tsvscode.getState()?.currentProject;

        const response = await fetch(`${apiBaseUrl}/threads?projectId=${currentProject.id}`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        threads = payload.threads;

        
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
        <Thread thread={thread} username={user.name}/>
    {/each}
</div>
