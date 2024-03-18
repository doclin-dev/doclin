<script type="ts">
    import Button from "../Button.svelte";
    import { Page } from "../../enums";
    import Thread from "../thread/Thread.svelte";
    import { onMount, onDestroy } from "svelte";
    import Reply from "./Reply.svelte";
    import { page, reload, threadSelected } from "../../state/store";
  import ReplyAddForm from "./ReplyAddForm.svelte";

    let replies : Array<{message: string, id: number}> = [];

    $: {
        if ($reload > 1) {
            loadReplies();
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


    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "getRepliesByThreadId":
                replies = message.value;
                break;
            case "postReply":
                const reply = message.value;
                replies = [...replies, reply];
                break;
        }
    };

    onMount(async () => {
        if ($threadSelected == null) {
            $page = Page.ThreadsViewer;
            return;
        }

        window.addEventListener("message", messageEventListener);

        loadReplies();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });

    const getReplyCountText = (count: number) => {
        if (count > 1) {
            return `${count} replies`;
        } else {
            return `${count} reply`;
        }
    }

</script>

<div class='reply-viewer'>
    <div class='topbar'>
        <div class="button-container">
            <Button icon='back-icon' title=' Back to threads' type='text' onClick={handleBackClick}/>
        </div>
    </div>

    <div>
        {#if $threadSelected}
            <Thread thread={$threadSelected} showReplyButton={false}/>
        {/if}

        <div class="reply-count-line">
            <div class="reply-count-divider-left"></div>
                <p>{getReplyCountText(replies.length)}</p>
            <div class="reply-count-divider-right"></div>
        </div>
    </div>

    <div style="padding-bottom: 0.5rem">
        {#if replies.length > 0 }
            {#each replies as reply (reply.id)}
                <Reply reply={reply} reloadReplies={loadReplies}/>
                <hr/>
            {/each}
        {/if}
    </div>
    
    <ReplyAddForm/>
</div>