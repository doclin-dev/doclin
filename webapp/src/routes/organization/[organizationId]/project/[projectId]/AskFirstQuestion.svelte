<script lang="ts">
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';

  export let organizationId: string;
  export let projectId: number;
</script>

<div
  class="flex flex-col items-center justify-center h-80 w-full p-6 mt-2 text-center border-4 border-dashed border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-md"
>
  <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Be the first to ask a question!</p>
  <a
    href={`/organization/${organizationId}/project/${projectId}/thread/askQuestion`}
    class="flex items-center bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-500"
  >
    <Icon icon={plusIcon} />
    Ask Question
  </a>
</div>
