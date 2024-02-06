<script lang="ts">
    import OverlayCard from './OverlayCard.svelte';
    import Button from './Button.svelte'
    import { tick, onMount, onDestroy } from 'svelte';
    import { activeTextEditor, editedReplyId, editedThreadId, page, threadSelected } from './store';
    import { ActiveTextEditor, Page } from '../enums';
    import { TextEditor } from './TextEditor';
    import moment from 'moment';

    export let thread: any;
    export let reloadThreads: () => void = () => {};
    export let showReplyButton: boolean = true;
    let lastEdited : string | null = thread?.lastReplied ? moment.utc(thread.lastReplied).fromNow() : null;
    let threadCreationTime : string = moment.utc(thread?.threadCreationTime).fromNow();
    let quillThreadEditor: TextEditor | null;

    const replyCountText = thread?.replyCount + ` ${thread?.replyCount > 1 ? 'replies': 'reply'}`

    setInterval(()=>{
        lastEdited = thread?.lastReplied ? moment.utc(thread.lastReplied).fromNow() : null;
        threadCreationTime = moment.utc(thread?.threadCreationTime).fromNow();
    }, 60000);

        
    const handleEditButtonClick = async () => {
        if ($editedThreadId === null && $editedReplyId === null) {
            $editedThreadId = thread.id;
            await tick();
            quillThreadEditor = new TextEditor('#thread-editor');
            quillThreadEditor.setContents(thread.delta);
            $activeTextEditor = ActiveTextEditor.ThreadTextEditor;
            quillThreadEditor.setActiveEditor(ActiveTextEditor.ThreadTextEditor);
        }
    }

    const handleOnSubmit = async () => {
        await tick();

        if (quillThreadEditor) {
            const { message:threadMessage, snippets, delta } = quillThreadEditor.getStructuredText();

            tsvscode.postMessage({ 
                type: "updateThread", 
                value: { 
                    threadId: thread.id, 
                    threadMessage: threadMessage,
                    snippets: snippets,
                    delta: delta
                }
            });

            quillThreadEditor?.removeToolbarTheme();
            quillThreadEditor = null;
            editedThreadId.set(null);
        }
    }

    const onCancel = () => {
        quillThreadEditor?.removeToolbarTheme();
        quillThreadEditor = null;
        editedThreadId.set(null);
        if ($activeTextEditor === null){
            if ($page === Page.ThreadsViewer){
                $activeTextEditor = ActiveTextEditor.ThreadsViewerTextEditor;
            } else if ($page === Page.ReplyViewer){
                $activeTextEditor = ActiveTextEditor.ReplyViewerTextEditor;
            }
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
            case "populateCodeSnippet":
                if ($activeTextEditor === ActiveTextEditor.ThreadTextEditor && $editedThreadId === thread.id) {
                    quillThreadEditor?.insertCodeSnippet(message.value);
                };
                break;
            case "deleteThread":
                $page = Page.ThreadsViewer;
                reloadThreads();
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
            <div class="card-name-header">{thread?.username}</div>
            <div class='button-container'>
                {#if showReplyButton}
                    <Button icon='reply' onClick={handleReplyButtonClick} type='text'/>
                {/if}

                <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
            </div>
        </div>
        <div class='creation-time'>{threadCreationTime}</div>
        {#if $editedThreadId === thread?.id}
            <div id="thread-editor"></div> 
            <div class='thread-editor-footer'>
                <Button variant='secondary' onClick={onCancel} title="Cancel"/>
                <Button variant='secondary' onClick={handleOnSubmit} title="Submit"/>
            </div>
        {:else}
            <div>{@html thread?.displayMessage}</div>
            {#if thread?.replyCount &&  $page === Page.ThreadsViewer}
                <div class="number-of-replies-button">
                    <Button 
                        textAlignment="flex-start" 
                        variant='primary' 
                        onClick={handleReplyButtonClick} 
                        title={replyCountText}
                        children={lastEdited ?? ""}
                        childrenClassName="last-reply"
                    />
                </div>
            {/if}
        {/if}
    </div>
    {#if $page === Page.ReplyViewer}
        <div class="reply-count-line">
            <div class="reply-count-divider"></div>
            <p>{replyCountText}</p>
            <div class="reply-count-divider"></div>
        </div>
    {/if}
</div>