<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import Quill from 'quill';
    import { tick } from 'svelte';
    import { editedThreadId, selectedThread } from './store.js';
    import { Page } from '../enums'; 

    export let thread: any;
    export let username: string;
    export let page: Page;
    export let reloadThreads: () => void = () => {};

    let quillThreadEditor: any;
    let threadEditMode: boolean = false;
    let threadMessage: string;

    async function updateThreadMessage(message: string) {
        await fetch(`${apiBaseUrl}/threads/${thread.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    message: message
                }),
                headers: {
                    "content-type": "application/json",
                },
            });
    }
        

    const handleEditButtonClick = async () => {
        if($editedThreadId !== null && $editedThreadId !== thread.id) {
            console.log('Fuck off!');
        } else {
            threadEditMode = true;
            editedThreadId.set(thread.id);
            await tick();
            quillThreadEditor = new Quill('#thread-editor', {
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

            quillThreadEditor.theme.modules.toolbar.container.style.background = '#f1f1f1';
            quillThreadEditor.theme.modules.toolbar.container.style.border = 'none';
        }
    }

    const handleOnSubmit = async () => {
        threadEditMode= false;
        await tick();
        threadMessage = quillThreadEditor.root.innerHTML;
        updateThreadMessage(threadMessage);
        thread.message = threadMessage;
        quillThreadEditor.theme.modules.toolbar.container.style.display = 'none';
        quillThreadEditor = null;
        editedThreadId.set(null);
    }
    const onCancel = () => {
        threadEditMode = false;
        quillThreadEditor.theme.modules.toolbar.container.style.display = 'none';
        quillThreadEditor = null;
        editedThreadId.set(null);
    }

    const handleDeleteButtonClick = async () => {
        try {
            await fetch(`${apiBaseUrl}/threads/delete/${thread.id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                },
            });

            reloadThreads();

        } catch (err) {
            console.log(err);
        }
    }

    const handleReplyButtonClick = () => {
        page = Page.ReplyViewer;
        selectedThread.set(thread);
        tsvscode.setState({ ...tsvscode.getState(), page });
    }
</script>

<style>
    .thread-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem;
    }

    .button-container{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .thread-card {
        display: flex;
        flex-direction: column;
        background-color: rgb(46, 48, 48);
        padding: 0.5rem;
        gap: 0.25;
        border-radius: 5px;
        border: 2px;
        margin-bottom: 0.5rem;
    }
    .thread-editor-footer {
        display: flex;
        padding-top: 0.5rem;
        flex-direction: row;
        justify-content: flex-end;
        gap: 0.25rem;
    }
</style>

<div class='thread-card'>
    <div class="thread-header">
        <div> {username}</div>
        <div class='button-container'>
            <Button icon='reply' onClick={handleReplyButtonClick} type='text'/>
            <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
        </div>
    </div>
    {#if threadEditMode}
    <div id="thread-editor">{@html thread.message}</div> 
    <div class='thread-editor-footer'>
        <Button variant='secondary' onClick={onCancel} title="Cancel"/>
        <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
    </div>
    {:else}
    <div>{@html thread.message}</div>
    {/if}

</div>