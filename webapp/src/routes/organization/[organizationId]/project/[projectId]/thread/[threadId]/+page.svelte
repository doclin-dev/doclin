<script lang="ts">
  import type { PageData } from '../$types';

  export let data: PageData;
  const thread = data.thread;
  let newReplyMessage = '';

  function submitReply() {
    // Handle form submission logic here (e.g., post reply)
    console.log('Reply submitted:', newReplyMessage);
    newReplyMessage = ''; // Reset the form after submission
  }
</script>

<div class="p-4">
  <!-- Thread Header -->
  <div class="bg-gray-800 text-white p-4 rounded-lg">
    <h1 class="text-2xl font-bold mb-2">{thread.title}</h1>
    <p class="text-sm">Posted by {thread.username} on {new Date(thread.createdAt).toLocaleDateString()}</p>
    {#if thread.lastReplied}
      <p class="text-sm text-gray-400">Last replied on {new Date(thread.lastReplied).toLocaleDateString()}</p>
    {/if}
    <p class="mt-4">{thread.message}</p>
  </div>

  <!-- Thread Replies -->
  <div class="mt-6">
    <h2 class="text-lg font-semibold mb-4">Replies ({thread.replyCount})</h2>
    {#each thread.replies as reply}
      <div class="bg-gray-700 text-white p-4 mb-4 rounded-lg">
        <p class="text-sm">Reply by {reply.username} on {new Date(reply.createdAt).toLocaleDateString()}</p>
        <p class="mt-2">{reply.message}</p>
      </div>
    {/each}
  </div>

  <!-- Reply Form -->
  <div class="mt-6 bg-gray-800 p-4 rounded-lg">
    <h2 class="text-lg font-semibold text-white mb-2">Post a Reply</h2>
    <textarea
      bind:value={newReplyMessage}
      class="w-full p-2 bg-gray-700 text-white rounded-lg"
      rows="4"
      placeholder="Type your reply..."
    ></textarea>
    <button on:click={submitReply} class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
      Submit Reply
    </button>
  </div>
</div>
