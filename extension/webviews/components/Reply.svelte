<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import { TextEditor } from "./TextEditor";
    import { onMount, tick, onDestroy } from 'svelte';
    import { editedReplyId, editedThreadId } from './store.js';
    import { WebviewStateManager } from '../WebviewStateManager';
    import { ActiveTextEditor } from '../enums';
  import moment from 'moment';

    export let reply: any;
    export let reloadReplies: () => void = () => {};

    let quillReplyCardEditor: any;
    let replyCardMessage: string;
    let replyCreationTime : string = moment.utc(reply?.replyCreationTime).fromNow();

    setInterval(()=>{
        replyCreationTime = moment.utc(reply?.replyCreationTime).fromNow();
    }, 60000);

    async function updateReplyMessage(message: string) {
        tsvscode.postMessage({
            type: "updateReply",
            value: { replyId: reply.id, replyMessage: message }
        });
    }

    const handleEditButtonClick = async () => {
        if ($editedReplyId == null && $editedThreadId === null) {
            editedReplyId.set(reply.id);
            await tick();
            quillReplyCardEditor = new TextEditor('#reply-card-editor');
            WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, ActiveTextEditor.ReplyTextEditor);
            quillReplyCardEditor.setActiveEditor(ActiveTextEditor.ReplyTextEditor);
        }
    }

    const handleOnSubmit = async () => {
        await tick();
        replyCardMessage = quillReplyCardEditor.getText();
        updateReplyMessage(replyCardMessage);
        editedReplyId.set(null);
    }
    
    const onCancel = () => {
        quillReplyCardEditor.removeToolbarTheme();
        quillReplyCardEditor = null;
        editedReplyId.set(null);
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, ActiveTextEditor.ReplyViewerTextEditor);
    }

    const handleDeleteButtonClick = async () => {
        tsvscode.postMessage({
            type: "deleteReply",
            value: { replyId: reply.id }
        });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch(message.type) {
            case "populateCodeSnippet":
                if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR) === ActiveTextEditor.ReplyTextEditor && $editedReplyId === reply.id) {
                    quillReplyCardEditor.insertCodeSnippet(message.value);
                }
                break;
            case "updateReply":
                if (reply.id === message.value?.id) {
                    reply.message = message.value?.message;
                    quillReplyCardEditor.removeToolbarTheme();
                    quillReplyCardEditor = null;
                    editedReplyId.set(null);
                }
                break;
            case "deleteReply":
                reloadReplies();
                break;
        }
    }

    onMount(() => {
        window.addEventListener("message", messageEventListener);
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div class='reply-card'>
    <div class="reply-card-header">
        <div class="card-name-header"> {reply.username}</div>
        <div class='button-container'>
            <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
        </div>
    </div>
    <div class='creation-time'>{replyCreationTime}</div>
    {#if $editedReplyId === reply.id}
        <div id="reply-card-editor">{@html reply.message}</div> 
        <div class='reply-card-footer'>
            <Button variant='secondary' onClick={onCancel} title="Cancel"/>
            <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
        </div>
    {:else}
        <div>{@html reply.message}</div>
    {/if}

</div>