<script lang="ts">
  import DropdownMenu from '$lib/components/DropdownMenu.svelte';
  import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
  import moment from 'moment';
  import { onMount } from 'svelte';

  export let thread: ThreadResponseDTO;
  export let organizationId: string;
  export let projectId: number;
  export let deleteThread: (threadId: number) => void;
  let lastReplied: string;
  let threadCreationTime: string;

  const TRUNCATE_LENGTH: number = 500;

  onMount(() => {
    updateDate();
    setInterval(() => updateDate(), 60000);
  });

  const cleanAndTruncate = (text: string, length: number): string => {
    const cleanedText = text
      .replace(/\[snippet_\d+\]/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/\r?\n|\r/g, ' ');

    return cleanedText.length > length ? cleanedText.slice(0, length) + '...' : cleanedText;
  };

  const editThread = () => {
    // TODO: Handle editing
  };

  const dropdownOptions = [
    { label: 'Edit', action: editThread },
    { label: 'Delete', action: () => deleteThread(thread.id) },
  ];

  const updateDate = () => {
    lastReplied = moment.utc(thread.lastReplied).fromNow();
    threadCreationTime = moment.utc(thread.createdAt).fromNow();
  };
</script>

<a
  href={`/organization/${organizationId}/project/${projectId}/thread/${thread.id}`}
  class="block p-4 hover:bg-gray-700 transition"
>
  <div class="flex justify-between items-center">
    <div class="text-xs text-gray-300">
      <span class="font-bold">{thread.username}</span> • {threadCreationTime}
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
  <p class="text-sm text-gray-300 mt-2">{cleanAndTruncate(thread.message, TRUNCATE_LENGTH)}</p>

  {#if thread.replyCount > 0}
    <div class="items-center p-2 mt-2 border border-gray-700 hover:bg-gray-800 rounded text-xs text-gray-300">
      <span class="text-blue-400">
        {thread.replyCount}
        {thread.replyCount === 1 ? 'Reply' : 'Replies'}
      </span>
      •
      {lastReplied}
    </div>
  {/if}
</a>
