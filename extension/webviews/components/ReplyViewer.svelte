<script type="ts">
    import OverlayCard from "./OverlayCard.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import Button from "./Button.svelte";
    import { ActiveTextEditor, Page } from "../enums";
    import Thread from "./Thread.svelte";
    import { onMount, onDestroy } from "svelte";
    import Reply from "./Reply.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import type { Thread as ThreadType } from "../types";
    import { TextEditor } from "./TextEditor";

    let thread: ThreadType = WebviewStateManager.getState(WebviewStateManager.type.THREAD_SELECTED);
    export let username: string;
    export let page: Page;

    let quillReplyViewer: any;
    let replies : Array<{message: string, id: number}> = [];
    let anonymousCheck: boolean = false;

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
            value: { threadId: thread.id, replyMessage: message, anonymous: anonymousCheck ? true : false }
        });
    }

    async function loadReplies () {
        tsvscode.postMessage({
            type: "getRepliesByThreadId",
            value: { threadId: thread.id }
        });
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
            if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR) === ActiveTextEditor.ReplyViewerTextEditor) quillReplyViewer.insertCodeSnippet(message.value);
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

<ViewerTopBar username={username} page={page}/>

<div class='reply-viewer'>
    <div class='topbar'>
        <div class="button-container">
            <Button icon='back-icon' type='text' onClick={handleBackClick}/>
        </div>
    </div>
    <div style="padding-bottom: 0.5rem">
        <Thread thread={thread} bind:page={page} showReplyButton={false}/>
    </div>
    <form>
        <div id="replyViewerEditor"></div>
        <label class="checkbox">
            <input type="checkbox" bind:checked={anonymousCheck}>
            Post as an anonymous user
        </label>
        <button on:click|preventDefault={onSubmit}>Submit</button>
    </form>
    <div>
        {#each replies as reply (reply.id)}
            <Reply reply={reply} reloadReplies={loadReplies}/>
        {/each}
    </div>
</div>