<script lang="ts">
  import ThreadCard from '$lib/ThreadCard.svelte';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import pencilIcon from '@iconify/icons-mdi/pencil';

  import type { PageData } from './$types';
  import FilterMenu from '$lib/FilterMenu.svelte';

  export let data: PageData;
</script>

<div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
  <h1 class="text-lg font-bold text-white">{data.project.name}</h1>

  <div class="flex-1 mx-4 max-w-3xl">
    <input
      type="text"
      placeholder="Search threads..."
      class="w-full px-4 py-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div class="space-x-2 flex items-center">
    <a
      href="/organization/{data.organizationId}/project/{data.project.id}/thread/askQuestion"
      class="flex items-center bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-500"
    >
      <Icon icon={plusIcon} />
      Ask Question
    </a>
    <a
      href="/organization/{data.organizationId}/project/{data.project.id}/thread/writeArticle"
      class="flex items-center border border-blue-200 text-blue-200 px-3 py-2 rounded-md hover:bg-blue-200 hover:text-blue-900"
    >
      <Icon icon={pencilIcon} />
      Write Article
    </a>
  </div>
</div>

<div class="px-4 pt-4 flex justify-center">
  <div class="max-w-6xl">
    <FilterMenu />

    {#each data.threads as thread}
      <hr class="border-gray-700" />
      <ThreadCard organizationId={data.organizationId} projectId={data.project.id} {thread} />
    {/each}
  </div>
</div>
