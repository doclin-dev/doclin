<script type="ts">
    import OverlayCard from "./OverlayCard.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import Button from "./Button.svelte";
    import Quill from 'quill';
    import { Page } from "../enums";
    import Thread from "./Thread.svelte";
    import { onMount } from "svelte";
    import Reply from "./Reply.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import type { Thread as ThreadType } from "../types";

    let thread: ThreadType;
    export let username: string;
    export let page: Page;

    let quillReplyViewer: any;
    let replies : Array<{message: string, id: number}> = [];

    async function initializeQuillEditor() {
        quillReplyViewer = new Quill('#replyViewerEditor', {
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
        
        quillReplyViewer.theme.modules.toolbar.container.style.background = '#f1f1f1';
        quillReplyViewer.theme.modules.toolbar.container.style.border = 'none';

        quillReplyViewer.on('text-change', () => {
            WebviewStateManager.setState(WebviewStateManager.type.REPLY_MESSAGE, quillReplyViewer.root.innerHTML);
        });
        
        quillReplyViewer.root.innerHTML = WebviewStateManager.getState(WebviewStateManager.type.REPLY_MESSAGE) || "";
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
    }

    const handleBackClick = () => {
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_SELECTED, null);
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const onSubmit= () => {
        postReplyMessage(quillReplyViewer.root.innerHTML);
        quillReplyViewer.setText("");
        WebviewStateManager.setState(WebviewStateManager.type.REPLY_MESSAGE, "");
    }

    onMount(async () => {
        thread = WebviewStateManager.getState(WebviewStateManager.type.THREAD_SELECTED);

        if (thread == null) {
            page = Page.ThreadsViewer;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            return;
        }

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "getRepliesByThreadId":
                    replies = message.value;
                    break;
                case "postReply":
                    const reply = message.value;
                    replies = [reply, ...replies];
                    break;
            }
        });

        initializeQuillEditor();
        loadReplies();
    });

</script>

<style>
    .topbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;  
        padding-bottom: 0.5rem;
        align-items: center;
    }
    #replyViewerEditor{
        width: 100%;
        height: 100px;
        resize: both; 
        overflow: auto;
    }
</style>

<ViewerTopBar username={username}/>

<div class='reply-viewer'>
    <div class='topbar'>
        <Button icon='back-icon' iconWidth={25} type='text' onClick={handleBackClick}/>
        <OverlayCard isEditable={false} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div style="padding-bottom: 0.5rem">
        <Thread thread={thread} page={page}/>
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