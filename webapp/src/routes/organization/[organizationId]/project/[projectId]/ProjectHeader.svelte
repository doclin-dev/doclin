<script lang="ts">
  import type { ProjectDTO } from '$shared/types/ProjectDTO';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';

  export let project: ProjectDTO;
  export let organizationId: string;
  export let searchThreads: (searchQuery: string) => void;
  export let searchQuery: string;

  let inputSearchQuery: string = searchQuery;
  let debounceTimeout: number;

  const handleInput = () => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      searchThreads(inputSearchQuery);
    }, 300);
  };
</script>

<div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
  <h1 class="text-lg font-bold text-white w-48 truncate">{project.name}</h1>

  <div class="flex-1 mx-4 max-w-3xl">
    <input
      type="text"
      bind:value={inputSearchQuery}
      placeholder={`Search in ${project.name}...`}
      class="w-full px-4 py-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      on:input={handleInput}
    />
  </div>

  <div class="space-x-2 flex items-center">
    <a
      href="/organization/{organizationId}/project/{project.id}/thread/askQuestion"
      class="flex items-center bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-500"
    >
      <Icon icon={plusIcon} />
      Ask Question
    </a>
  </div>
</div>
