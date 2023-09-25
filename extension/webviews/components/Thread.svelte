<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import Quill from 'quill';
    import { tick, onMount, onDestroy } from 'svelte';
    import { editedThreadId } from './store.js';
    import { Page } from '../enums'; 
    import { WebviewStateManager } from '../WebviewStateManager';

    export let thread: any;
    export let page: Page;
    export let reloadThreads: () => void = () => {};

    let quillThreadEditor: any;
    let threadEditMode: boolean = false;
        
    const handleEditButtonClick = async () => {
        if($editedThreadId == null) {
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
        const threadMessage = quillThreadEditor.root.innerHTML;

        tsvscode.postMessage({ type: "updateThread", value: { threadId: thread.id, threadMessage: threadMessage }});

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
        tsvscode.postMessage({ type: "deleteThread", value: { threadId: thread.id }});

        WebviewStateManager.setState(WebviewStateManager.type.THREAD_SELECTED, null);
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const handleReplyButtonClick = () => {
        page = Page.ReplyViewer;
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_SELECTED, thread);
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const messageEventListener = async(event: any) => {
        const message = event.data;
        switch(message.type) {
            case "deleteThread":
                page = Page.ThreadsViewer;
                WebviewStateManager.setState(WebviewStateManager.type.PAGE, Page.ThreadsViewer);
                reloadThreads();
                break;
            case "updateThread":
                const updatedThread = message.value;
                if (thread.id == updatedThread.id) thread.message = updatedThread.message;
                break;
        }
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div class='thread-card'>
    <div class="thread-header">
        <div>{thread?.username}</div>
        <div class='button-container'>
            <Button icon='reply' onClick={handleReplyButtonClick} type='text'/>
            <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
        </div>
    </div>
    {#if threadEditMode}
    <div id="thread-editor">{@html thread?.message}</div> 
    <div class='thread-editor-footer'>
        <Button variant='secondary' onClick={onCancel} title="Cancel"/>
        <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
    </div>
    {:else}
    <div>{@html thread?.message}</div>
    {/if}

</div>