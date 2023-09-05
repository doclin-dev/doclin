<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import Quill from 'quill';
    import { tick } from 'svelte';
    import { editedReplyId } from './store.js';

    export let reply: any;
    export let username: string;
    export let reloadReplies: () => void = () => {};

    let quillReplyCardEditor: any;
    let replyCardEditMode: boolean = false;
    let replyCardMessage: string;

    async function updateReplyMessage(message: string) {
        await fetch(`${apiBaseUrl}/replies/${reply.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    message: message
                }),
                headers: {
                    "content-type": "application/json"
                },
            });
    }
        

    const handleEditButtonClick = async () => {
        if($editedReplyId !== null && $editedReplyId !== reply.id) {
            console.log('Fuck off!');
        } else {
            replyCardEditMode = true;
            editedReplyId.set(reply.id);
            await tick();
            quillReplyCardEditor = new Quill('#reply-card-editor', {
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

            quillReplyCardEditor.theme.modules.toolbar.container.style.background = '#f1f1f1';
            quillReplyCardEditor.theme.modules.toolbar.container.style.border = 'none';
        }
    }

    const handleOnSubmit = async () => {
        replyCardEditMode= false;
        await tick();
        replyCardMessage = quillReplyCardEditor.root.innerHTML;
        updateReplyMessage(replyCardMessage);
        reply.message = replyCardMessage;
        quillReplyCardEditor.theme.modules.toolbar.container.style.display = 'none';
        quillReplyCardEditor = null;
        editedReplyId.set(null);
    }
    const onCancel = () => {
        replyCardEditMode = false;
        quillReplyCardEditor.theme.modules.toolbar.container.style.display = 'none';
        quillReplyCardEditor = null;
        editedReplyId.set(null);
    }

    const handleDeleteButtonClick = async () => {
        try {
            await fetch(`${apiBaseUrl}/replies/delete/${reply.id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                },
            });

            reloadReplies();

        } catch (err) {
            console.log(err);
        }
    }

</script>

<style>
    .reply-card-header {
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
    .reply-card {
        display: flex;
        flex-direction: column;
        background-color: rgb(46, 48, 48);
        padding: 0.5rem;
        gap: 0.25;
        border-radius: 5px;
        border: 2px;
        margin-bottom: 0.5rem;
    }
    .reply-card-footer {
        display: flex;
        padding-top: 0.5rem;
        flex-direction: row;
        justify-content: flex-end;
        gap: 0.25rem;
    }
</style>

<div class='reply-card'>
    <div class="reply-card-header">
        <div> {username}</div>
        <div class='button-container'>
            <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
        </div>
    </div>
    {#if replyCardEditMode}
    <div id="reply-card-editor">{@html reply.message}</div> 
    <div class='reply-card-footer'>
        <Button variant='secondary' onClick={onCancel} title="Cancel"/>
        <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
    </div>
    {:else}
    <div>{@html reply.message}</div>
    {/if}

</div>