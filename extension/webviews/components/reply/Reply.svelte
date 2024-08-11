<script lang="ts">
  import DropdownMenu from '../DropdownMenu.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { editedReplyId, editedThreadId } from '../../state/store';
  import moment from 'moment';
  import SeeMore from '../SeeMore.svelte';
  import ReplyEdit from './ReplyEdit.svelte';
  import type { Reply } from '../../types';

  export let reply: Reply;
  export let reloadReplies: () => void = () => {};

  let replyCreationTime: string = moment.utc(reply?.createdAt).fromNow();

  setInterval(() => {
    replyCreationTime = moment.utc(reply?.createdAt).fromNow();
  }, 60000);

  const handleEditButtonClick = async () => {
    if ($editedReplyId == null && $editedThreadId === null) {
      $editedReplyId = reply.id;
    }
  };

  const handleDeleteButtonClick = async () => {
    tsvscode.postMessage({
      type: 'deleteReply',
      value: { replyId: reply.id },
    });
  };

  const dropdownOptions = [
    {
      key: 'edit',
      label: 'Edit',
      handler: handleEditButtonClick,
    },
    {
      key: 'delete',
      label: 'Delete',
      handler: handleDeleteButtonClick,
      className: 'text-danger',
    },
  ];

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'deleteReply':
        const deletedReply = message.value;
        if (reply.id == deletedReply?.id) {
          reloadReplies();
        }
        break;
      case 'updateReply':
        const updatedReply = message.value;
        if (reply.id === updatedReply?.id) {
          reply = updatedReply;
          editedReplyId.set(null);
        }
        break;
    }
  };

  onMount(() => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<div class="reply-card">
  <div class="reply-card-header">
    <div class="card-name-header">
      {reply.username}
      <span class="creation-time">{replyCreationTime}</span>
    </div>

    {#if reply.canEdit}
      <div class="button-container">
        <DropdownMenu options={dropdownOptions} />
      </div>
    {/if}
  </div>

  {#if $editedReplyId === reply.id}
    <ReplyEdit {reply} />
  {:else}
    <div><SeeMore displayMessage={reply.displayMessage} /></div>
  {/if}
</div>
