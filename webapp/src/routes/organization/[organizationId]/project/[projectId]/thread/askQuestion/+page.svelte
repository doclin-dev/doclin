<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';
</script>

<div class="flex flex-col items-center justify-center">
  <!-- Header with close button -->
  <div class="w-full max-w-4xl bg-gray-800 rounded-lg p-6 relative">
    <button class="absolute top-4 right-4 text-gray-300 hover:text-gray-100 transition duration-200">
      <Icon icon={closeIcon} class="w-6 h-6" />
    </button>

    <!-- Form title -->
    <h2 class="text-2xl font-bold text-gray-100 mb-6">Ask A Question</h2>

    <!-- Form inputs -->

    <div id="thread-editor" class="textEditor"></div>
  </div>
</div>
