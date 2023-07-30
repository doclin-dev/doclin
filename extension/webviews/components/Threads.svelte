<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;
    
    let quillEditor;
    let threadMessage = tsvscode.getState()?.threadMessage || "";
    let threads: Array<{ message: string; id: number }> = [];

    async function postThreadMessage(t: string) {
        const response = await fetch(`${apiBaseUrl}/threads`, {
                method: "POST",
                body: JSON.stringify({
                    message: t,
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
        const cursorPosition = selection ? selection.index : quillEditor.getLength();

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
        threadMessage="";
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    function handleThreadMessageUpdate() {
        // threadMessage = quill.get;
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    async function submitThreadMessage() {
        threadMessage = quillEditor.root.innerHTML;
        console.log(threadMessage);
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

        const response = await fetch(`${apiBaseUrl}/threads`, {
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
