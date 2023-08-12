<script>
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import Quill from 'quill';
    import { tick } from 'svelte';
    import { editedThreadId } from './store.js';

    export let thread;
    export let username;
    let quillThreadEditor;

    let threadEditMode = false;

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
        thread.message = quillThreadEditor.root.innerHTML;
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

    const handleDeleteButtonClick = () => {
        console.log('Delete Button clicked!');
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
        flex-direction: row;
        justify-content: flex-end;
    }
</style>

<div class='thread-card'>
    <div class="thread-header">
        <div> {username}</div>
        <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
    </div>
    {#if threadEditMode}
    <div id="thread-editor">{@html thread.message}</div> 
    <div class='thread-editor-footer'>
        <Button onClick={onCancel} title="Cancel"/>
        <Button onClick={handleOnSubmit} title="Submit"/>
    </div>
    {:else}
    <div>{@html thread.message}</div>
    {/if}

</div>