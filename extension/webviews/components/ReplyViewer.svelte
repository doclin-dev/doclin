<script type="ts">
    import OverlayCard from "./OverlayCard.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import Button from "./Button.svelte";
    import Quill from 'quill';
    import { ActiveTextEditor, Page } from "../enums";
    import Thread from "./Thread.svelte";
    import { onMount, onDestroy } from "svelte";
    import Reply from "./Reply.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import type { Thread as ThreadType } from "../types";
    import { TextEditor } from "./TextEditor";

    let thread: ThreadType;
    export let username: string;
    export let page: Page;

    let quillReplyViewer: any;
    let replies : Array<{message: string, id: number}> = [];

    async function initializeQuillEditor() {
        quillReplyViewer = new TextEditor('#replyViewerEditor')

        quillReplyViewer.onTextChange(() => {
            WebviewStateManager.setState(WebviewStateManager.type.REPLY_MESSAGE, quillReplyViewer.getText());
        });
        
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, ActiveTextEditor.ReplyViewerTextEditor);
        quillReplyViewer.setActiveEditor(ActiveTextEditor.ReplyViewerTextEditor);
        const message = WebviewStateManager.getState(WebviewStateManager.type.REPLY_MESSAGE) || "";
        quillReplyViewer.setText(message);

    }

    async function postReplyMessage(message: string) {
        tsvscode.postMessage({
            type: "postReply",
            value: { threadId: thread.id, replyMessage: message }
        });
    }

    async function loadReplies () {
        tsvscode.postMessage({
            type: "getRepliesByThreadId",
            value: { threadId: thread.id }
        });
    }

    const handleDeleteButtonClick = () => {
        tsvscode.postMessage({
            type: "deleteThread",
            value: { threadId: thread.id }
        });

        handleBackClick();
    }

    const handleBackClick = () => {
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_SELECTED, null);
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const onSubmit= () => {
        postReplyMessage(quillReplyViewer.getText());
        quillReplyViewer.setText("");
        WebviewStateManager.setState(WebviewStateManager.type.REPLY_MESSAGE, "");
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateCodeSnippet":
            // if ($editedThreadId === null && $editedReplyId === null) quillReplyViewer.insertCodeSnippet( message.value);
            if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR)===2) quillReplyViewer.insertCodeSnippet(message.value);
                break;
            case "getRepliesByThreadId":
                replies = message.value;
                break;
            case "postReply":
                const reply = message.value;
                replies = [reply, ...replies];
                break;
        }
    };

    onMount(async () => {
        thread = WebviewStateManager.getState(WebviewStateManager.type.THREAD_SELECTED);

        if (thread == null) {
            page = Page.ThreadsViewer;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            return;
        }

        window.addEventListener("message", messageEventListener);

        initializeQuillEditor();
        loadReplies();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });

</script>

<ViewerTopBar username={username}/>

<div class='reply-viewer'>
    <div class='topbar'>
        <Button icon='back-icon' iconWidth={25} type='text' onClick={handleBackClick}/>
        <OverlayCard isEditable={false} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div style="padding-bottom: 0.5rem">
        <Thread thread={thread} bind:page={page}/>
    </div>
    <form>
        <div id="replyViewerEditor"></div>
        <button on:click|preventDefault={onSubmit}>Submit</button>
    </form>
    <div>
        {#each replies as reply (reply.id)}
            <Reply reply={reply} reloadReplies={loadReplies}/>
        {/each}
    </div>
</div>