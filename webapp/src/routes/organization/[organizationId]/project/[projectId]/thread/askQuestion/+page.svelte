<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';

  // Dispatcher to handle closing the form
  const dispatch = createEventDispatcher();

  // Function to close the form
  const closeForm = () => {
    dispatch('close');
  };

  let title = '';
  let content = '';

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Thread created:', { title, content });
    closeForm();
  };
</script>

<div class="flex flex-col items-center justify-center">
  <!-- Header with close button -->
  <div class="w-full max-w-4xl bg-gray-800 rounded-lg p-6 relative">
    <button
      class="absolute top-4 right-4 text-gray-300 hover:text-gray-100 transition duration-200"
      on:click={closeForm}
    >
      <Icon icon={closeIcon} class="w-6 h-6" />
    </button>

    <!-- Form title -->
    <h2 class="text-2xl font-bold text-gray-100 mb-6">Ask A Question</h2>

    <!-- Form inputs -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- Title input -->
      <div>
        <label class="block text-gray-400 mb-2">Title</label>
        <input
          type="text"
          bind:value={title}
          placeholder="Enter your thread title"
          class="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <!-- Content textarea -->
      <div>
        <label class="block text-gray-400 mb-2">Content</label>
        <textarea
          bind:value={content}
          placeholder="Write your thread content here..."
          rows="8"
          class="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <!-- Submit button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
        >
          Create Thread
        </button>
      </div>
    </form>
  </div>
</div>
