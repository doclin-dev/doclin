<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import { tick, onMount, onDestroy } from 'svelte';
    import { editedReplyId, editedThreadId, page, threadSelected } from '../state/store';
    import { Page } from '../enums';
    import moment from 'moment';
    import ThreadEdit from './ThreadEdit.svelte';
    import Icon from './Icon.svelte';
    import SeeMore from './SeeMore.svelte';
    import type { Thread } from '../types';

    export let thread: Thread;
    export let reloadThreads: () => void = () => {};
    export let showReplyButton: boolean = true;
    let lastEdited : string | null = thread?.lastReplied ? moment.utc(thread.lastReplied).fromNow() : null;
    let threadCreationTime : string = moment.utc(thread?.threadCreationTime).fromNow();

    setInterval(()=>{
        lastEdited = thread?.lastReplied ? moment.utc(thread.lastReplied).fromNow() : null;
        threadCreationTime = moment.utc(thread?.threadCreationTime).fromNow();
    }, 60000);

        
    const handleEditButtonClick = async () => {
        if ($editedThreadId === null && $editedReplyId === null) {
            $editedThreadId = thread.id;
            await tick();
        }
    }

    const handleDeleteButtonClick = async () => {
        tsvscode.postMessage({ type: "deleteThread", value: { threadId: thread.id }});

        $threadSelected = null;
        $page = Page.ThreadsViewer;
    }

    const handleReplyButtonClick = () => {
        if ($editedThreadId !== null){
            return "Cancel or submit the edit first!";
        }
        $page = Page.ReplyViewer;
        $threadSelected = thread;
    }

    const messageEventListener = async(event: any) => {
        const message = event.data;
        switch(message.type) {
            case "deleteThread":
                const deletedThread = message.value;
                if (thread.id == deletedThread.id) {
                    $page = Page.ThreadsViewer;
                    reloadThreads();
                }
                break;
            case "updateThread":
                const updatedThread = message.value;
                if (thread.id == updatedThread.id) {
                    thread = updatedThread;
                }
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

<div>
    <div class='thread-card'>
        <div class="thread-header">
        
            <div class="card-name-header">
                {thread?.username} 
                <span class='creation-time'>{threadCreationTime}</span></div>

            <div class='button-container'>
                {#if showReplyButton}
                    <Button icon='reply' onClick={handleReplyButtonClick} type='text'/>
                {/if}

                <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
            </div>
        </div>

        {#if thread?.snippets?.length === 0}
            <div class='thread-file-path-container mb-2'>
                {#if thread?.gitBranch}
                    <div class='thread-file-path-text'>
                        <Icon name='git' width={15} height={15} /> {thread?.gitBranch}
                    </div>
                {/if}

                {#if thread?.filePath}
                    <div class='thread-file-path-text'>
                        <Icon name='file' width={15} height={15} /> {thread?.filePath}
                    </div>
                {/if}
            </div>
        {/if}

        {#if $editedThreadId === thread?.id}
            <ThreadEdit thread={thread}/>
        {:else}
            <div class="thread-title">{thread?.title ?? ""}</div>

            <div><SeeMore content={thread?.displayMessage}/></div>
            
            {#if thread?.replyCount &&  $page === Page.ThreadsViewer}
                <div class="number-of-replies-button">
                    <Button 
                        textAlignment="flex-start" 
                        variant='primary' 
                        onClick={handleReplyButtonClick} 
                        title={thread?.replyCount + ` ${thread?.replyCount > 1 ? 'replies': 'reply'}`}
                        children={lastEdited ?? ""}
                        childrenClassName="last-reply"
                    />
                </div>
            {/if}
        {/if}
    </div>
</div>