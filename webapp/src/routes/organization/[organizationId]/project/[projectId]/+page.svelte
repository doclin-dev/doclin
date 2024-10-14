<script lang="ts">
  import ThreadCard from './ThreadCard.svelte';
  import type { PageData } from './$types';
  import FilterMenu from './FilterMenu.svelte';
  import AskFirstQuestion from './AskFirstQuestion.svelte';
  import ProjectHeader from './ProjectHeader.svelte';
  import { apiService } from '$lib/apiService';
  import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
  import { lastFocusedThread } from '$lib/stores/lastFocusedThread';
  import { onMount } from 'svelte';

  export let data: PageData;
  let threads: ThreadResponseDTO[];
  $: threads = data.threads;

  const PROJECT_URL = `/organization/${data.organizationId}/project/${data.project.id}`;

  onMount(() => {
    if ($lastFocusedThread) {
      const element = document.getElementById($lastFocusedThread.toString());
      if (element) {
        element.focus();
      }
    }
  });

  const searchThreads = async (searchQuery: string) => {
    if (searchQuery) {
      const response = await apiService.thread.searchThreads(searchQuery, data.project.id, data.organizationId);
      threads = response.data;
      history.pushState(history.state, '', `${PROJECT_URL}?search=${searchQuery}`);
    } else {
      const response = await apiService.thread.getAllThreads(data.organizationId, data.project.id);
      threads = response.data;
      history.pushState(history.state, '', PROJECT_URL);
    }
  };
</script>

<ProjectHeader
  project={data.project}
  organizationId={data.organizationId}
  {searchThreads}
  searchQuery={data.searchQuery}
/>

<div class="px-4 pt-4 flex justify-center">
  <div class="w-full max-w-6xl">
    {#if threads.length > 0}
      <FilterMenu />
      {#each threads as thread}
        <hr class="border-gray-700" />
        <ThreadCard organizationId={data.organizationId} projectId={data.project.id} {thread} />
      {/each}
    {:else if !data.searchQuery}
      <AskFirstQuestion organizationId={data.organizationId} projectId={data.project.id} />
    {/if}
  </div>
</div>
