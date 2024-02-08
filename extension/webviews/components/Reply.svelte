<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import { TextEditor } from "./TextEditor";
    import { onMount, tick, onDestroy } from 'svelte';
    import { activeTextEditor, editedReplyId, editedThreadId } from '../state/store';
    import { ActiveTextEditor } from '../enums';
    import moment from 'moment';

    export let reply: any;
    export let reloadReplies: () => void = () => {};

    let quillReplyCardEditor: TextEditor | null;
    let replyCreationTime : string = moment.utc(reply?.replyCreationTime).fromNow();

    setInterval(()=>{
        replyCreationTime = moment.utc(reply?.replyCreationTime).fromNow();
    }, 60000);

    async function updateReplyMessage(message: string, snippets: any[], delta: any) {
        tsvscode.postMessage({
            type: "updateReply",
            value: { 
                replyId: reply.id, 
                replyMessage: message,
                snippets: snippets,
                delta: delta
            }
        });
    }

    const handleEditButtonClick = async () => {
        if ($editedReplyId == null && $editedThreadId === null) {
            $editedReplyId = reply.id;
            await tick();
            quillReplyCardEditor = new TextEditor('#reply-card-editor');
            quillReplyCardEditor.setContents(reply.delta);
            $activeTextEditor = ActiveTextEditor.ReplyTextEditor;
            quillReplyCardEditor.setActiveEditor(ActiveTextEditor.ReplyTextEditor);
        }
    }

    const handleOnSubmit = async () => {
        await tick();

        if (!quillReplyCardEditor) {
            return;
        }

        const { message: replyMessage, snippets, delta } = quillReplyCardEditor.getStructuredText();

        updateReplyMessage(replyMessage, snippets, delta);
        editedReplyId.set(null);
    }
    
    const onCancel = () => {
        if (!quillReplyCardEditor) {
            return;
        }

        quillReplyCardEditor.removeToolbarTheme();
        quillReplyCardEditor = null;
        editedReplyId.set(null);
        $activeTextEditor = ActiveTextEditor.ReplyViewerTextEditor;
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
                if ($activeTextEditor === ActiveTextEditor.ReplyTextEditor && $editedReplyId === reply.id) {
                    quillReplyCardEditor?.insertCodeSnippet(message.value);
                }
                break;
            case "updateReply":
                const updatedReply = message.value;
                if (reply.id === updatedReply?.id) {
                    reply = updatedReply;
                    quillReplyCardEditor?.removeToolbarTheme();
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
        <div id="reply-card-editor"></div> 
        <div class='reply-card-footer'>
            <Button variant='secondary' onClick={onCancel} title="Cancel"/>
            <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
        </div>
    {:else}
        <div>{@html reply.displayMessage}</div>
    {/if}

</div>