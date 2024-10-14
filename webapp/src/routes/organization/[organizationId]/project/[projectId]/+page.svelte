<script lang="ts">
  import ThreadCard from './ThreadCard.svelte';
  import type { PageData } from './$types';
  import FilterMenu from './FilterMenu.svelte';
  import AskFirstQuestion from './AskFirstQuestion.svelte';
  import ProjectHeader from './ProjectHeader.svelte';
  import { apiService } from '$lib/apiService';
  import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
  import { error } from '@sveltejs/kit';
  import { pushState } from '$app/navigation';

  export let data: PageData;
  let threads: ThreadResponseDTO[];
  $: threads = data.threads;

  const PROJECT_URL = `/organization/${data.organizationId}/project/${data.project.id}`;

  const searchThreads = async (searchQuery: string) => {
    if (searchQuery) {
      const response = await apiService.thread.searchThreads(searchQuery, data.project.id, data.organizationId);
      threads = response.data;
      pushState(`${PROJECT_URL}?search=${searchQuery}`, '');
    } else {
      const response = await apiService.thread.getAllThreads(data.organizationId, data.project.id);
      threads = response.data;
      pushState(PROJECT_URL, '');
    }
  };

  const deleteThread = async (threadId: number) => {
    const response = await apiService.thread.deleteThread(data.organizationId, data.project.id, threadId);
    if (response.status === 200) {
      threads = threads.filter((thread) => thread.id != response.data.id);
    } else {
      error(response.status, 'Could not delete thread');
    }
  };
</script>

<ProjectHeader project={data.project} organizationId={data.organizationId} {searchThreads} />

<div class="px-4 pt-4 flex justify-center">
  <div class="w-full max-w-6xl">
    {#if threads.length > 0}
      <FilterMenu />
      {#each threads as thread}
        <hr class="border-gray-700" />
        <ThreadCard organizationId={data.organizationId} projectId={data.project.id} {thread} {deleteThread} />
      {/each}
    {:else}
      <AskFirstQuestion organizationId={data.organizationId} projectId={data.project.id} />
    {/if}
  </div>
</div>
