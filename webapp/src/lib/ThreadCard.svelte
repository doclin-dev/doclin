<script lang="ts">
  import DropdownMenu from '$lib/DropdownMenu.svelte';
  import type { ThreadResponseDTO } from '../../../shared/types/ThreadResponseDTO';

  export let thread: ThreadResponseDTO;
  export let organizationId: string;
  export let projectId: number;
  const truncateLength: number = 500;

  function cleanAndTruncate(text: string, length: number): string {
    const cleanedText = text.replace(/<\/?[^>]+(>|$)/g, '').replace(/\r?\n|\r/g, ' ');
    return cleanedText.length > length ? cleanedText.slice(0, length) + '...' : cleanedText;
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  function editThread() {
    // Handle edit action
    console.log('Edit thread', thread.id);
  }

  function deleteThread() {
    // Handle delete action
    console.log('Delete thread', thread.id);
  }

  const dropdownOptions = [
    { label: 'Edit', action: editThread },
    { label: 'Delete', action: deleteThread },
  ];
</script>

<a
  href={`/organization/${organizationId}/project/${projectId}/thread/${thread.id}`}
  class="block p-4 hover:bg-gray-700 transition"
>
  <div class="flex justify-between items-center">
    <div class="text-xs text-gray-300">
      <span class="font-bold">{thread.username}</span> • {formatDate(thread.createdAt)}
    </div>
    <div class="flex items-center space-x-2">
      {#if thread.gitBranch}
        <span class="bg-gray-700 text-xs text-gray-100 px-2 py-1 rounded">{thread.gitBranch}</span>
      {/if}
      {#if thread.filePath}
        <span class="bg-gray-700 text-xs text-gray-100 px-2 py-1 rounded">{thread.filePath}</span>
      {/if}

      <DropdownMenu options={dropdownOptions} />
    </div>
  </div>

  <h2 class="text-lg font-semibold text-gray-200 mt-2">{thread.title}</h2>
  <p class="text-sm text-gray-300 mt-2">{cleanAndTruncate(thread.message, truncateLength)}</p>

  <div class="flex justify-between items-center mt-4">
    <div class="text-xs text-gray-300">
      {thread.replyCount}
      {thread.replyCount === 1 ? 'Reply' : 'Replies'}
    </div>
    <div class="text-xs text-gray-300">
      {#if thread.lastReplied}
        Last replied: {formatDate(thread.lastReplied)}
      {/if}
    </div>
  </div>
</a>
