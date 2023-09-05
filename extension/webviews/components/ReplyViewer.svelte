<script type="ts">
    import OverlayCard from "./OverlayCard.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import Button from "./Button.svelte";
    import Quill from 'quill';
    import { Page } from "../enums";
    import { selectedThread } from './store.js';
    import Thread from "./Thread.svelte";
    import { onMount } from "svelte";
    import Reply from "./Reply.svelte";
  import { WebviewStateManager } from "../WebviewStateManager";

    export let thread: any;
    export let projectName: string;
    export let username: string;
    export let page: Page;

    let quillReplyViewer: any;
    let replies : Array<{message: string, id: number}> = [];
    let replyMessage: string;

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
    }

    async function postReplyMessage(message: string) {
        const response = await fetch(`${apiBaseUrl}/replies/${thread.id}`, {
                method: "POST",
                body: JSON.stringify({
                    message: message,
                }),
                headers: {
                    "content-type": "application/json",
                },
            });
        const { reply } = await response.json();
        replies = [reply, ...replies];
    }

    async function loadReplies () {
        const response = await fetch(`${apiBaseUrl}/replies/${thread.id}`, {
            headers: {
            },
        });

        const payload = await response.json();
        replies = payload.replies;
    }

    const handleDeleteButtonClick = () => {
        console.log('Delete button clicked!');
    }

    const handleBackClick = () => {
        selectedThread.set(null);
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const onSubmit= () => {
        replyMessage = quillReplyViewer.root.innerHTML;
        postReplyMessage(replyMessage);
        replyMessage = "";
        quillReplyViewer.setText(replyMessage);
        tsvscode.setState({...tsvscode.getState(), replyMessage});
    }

    onMount(async () => {
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

<ViewerTopBar username={username} projectName={projectName}/>

<div class='reply-viewer'>
    <div class='topbar'>
        <Button icon='back-icon' iconWidth={25} type='text' onClick={handleBackClick}/>
        <OverlayCard isEditable={false} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div style="padding-bottom: 0.5rem">
        <Thread thread={thread} username={username} page={page}/>
    </div>
    <form>
        <div id="replyViewerEditor"></div>
        <button on:click|preventDefault={onSubmit}>Submit</button>
    </form>
    <div>
        {#each replies as reply (reply.id)}
            <Reply reply={reply} username={username} reloadReplies={loadReplies}/>
        {/each}
    </div>
</div>