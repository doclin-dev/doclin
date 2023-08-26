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

    export let thread: any;
    export let projectName: string;
    export let username: string;
    export let page: Page;
    export let accessToken: any;

    let quillReplyEditor: any;
    let replies: any = [];

    async function initializeQuillEditor() {
        quillReplyEditor = new Quill('#replyEditor', {
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
        
        quillReplyEditor.theme.modules.toolbar.container.style.background = '#f1f1f1';
        quillReplyEditor.theme.modules.toolbar.container.style.border = 'none';
    }

    async function postReplyMessage(message) {
        const response = await fetch(`${apiBaseUrl}/replies/${thread.id}`, {
                method: "POST",
                body: JSON.stringify({
                    message: message,
                }),
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                },
            });
        const { reply } = await response.json();
        replies = [reply, ...replies];
    }

    async function loadReplies () {
        const response = await fetch(`${apiBaseUrl}/replies/${thread.id}`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
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
        tsvscode.setState({ ...tsvscode.getState(), page});
    }

    const onSubmit= () => {
        console.log("Submitted!");
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
    #replyEditor{
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
        <Thread thread={thread} username={username} page={page}/>
    </div>
    <form>
        <div id="replyEditor"></div>
        <button on:click|preventDefault={onSubmit}>Submit</button>
    </form>
    <div>
        {#each replies as reply (reply.id)}
            <Reply reply={reply} username={username}/>
        {/each}
    </div>
</div>