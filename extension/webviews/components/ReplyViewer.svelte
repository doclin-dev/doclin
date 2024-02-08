<script type="ts">
    import Button from "./Button.svelte";
    import { ActiveTextEditor, Page } from "../enums";
    import Thread from "./Thread.svelte";
    import { onMount, onDestroy } from "svelte";
    import Reply from "./Reply.svelte";
    import { TextEditor } from "./TextEditor";
    import { activeTextEditor, currentOrganization, page, replyContents, threadSelected } from "../state/store";

    let quillReplyViewer: TextEditor;
    let replies : Array<{message: string, id: number}> = [];
    let anonymousCheck: boolean = false;
    let organizationUsers = $currentOrganization?.members;

    async function initializeQuillEditor() {
        quillReplyViewer = new TextEditor('#replyViewerEditor', organizationUsers);

        quillReplyViewer.onTextChange(() => {
            $replyContents = quillReplyViewer.getContents();
        });
        
        $activeTextEditor = ActiveTextEditor.ReplyViewerTextEditor;
        quillReplyViewer.setActiveEditor(ActiveTextEditor.ReplyViewerTextEditor);
        quillReplyViewer.setContents($replyContents);
    }

    async function postReplyMessage(message: string, snippets: any[], delta: any, mentionedUserIds: number[]) {
        if ($threadSelected) {
            tsvscode.postMessage({
                type: "postReply",
                value: { 
                    threadId: $threadSelected.id, 
                    replyMessage: message, 
                    anonymous: anonymousCheck ? true : false,
                    snippets,
                    delta,
                    mentionedUserIds
                }
            });
        }
    }

    async function loadReplies () {
        if ($threadSelected) {
            tsvscode.postMessage({
                type: "getRepliesByThreadId",
                value: { threadId: $threadSelected.id }
            });
        }
    }

    const handleBackClick = () => {
        $threadSelected = null;
        $page = Page.ThreadsViewer;
    }

    const onSubmit= () => {
        const { message: replyMessage, snippets, delta, mentionedUserIds } = quillReplyViewer.getStructuredText();
        postReplyMessage(replyMessage, snippets, delta, mentionedUserIds);
        quillReplyViewer.setText("");
        $replyContents = "";
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateCodeSnippet":
                if ($activeTextEditor === ActiveTextEditor.ReplyViewerTextEditor) {
                    quillReplyViewer.insertCodeSnippet(message.value);
                }
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
        if ($threadSelected == null) {
            $page = Page.ThreadsViewer;
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

<div class='reply-viewer'>
    <div class='topbar'>
        <div class="button-container">
            <Button icon='back-icon' type='text' onClick={handleBackClick}/>
        </div>
    </div>
    <div style="padding-bottom: 0.5rem">
        <Thread thread={$threadSelected} showReplyButton={false}/>
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