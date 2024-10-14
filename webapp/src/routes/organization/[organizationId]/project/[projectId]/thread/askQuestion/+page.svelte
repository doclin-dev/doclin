<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';
  import { TextEditor } from '$lib/TextEditor';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { apiService } from '$lib/apiService';
  import type { ThreadCreateDTO } from '$shared/types/ThreadCreateDTO';
  import type { PageData } from './$types';
  import { user } from '$lib/stores/user';

  export let data: PageData;
  let organizationId: string = $page.params.organizationId;
  let projectId: number = parseInt($page.params.projectId);
  let title: string;
  let textEditor: TextEditor;
  let anonymous: boolean;

  const projectUrl = `/organization/${organizationId}/project/${projectId}`;

  onMount(() => {
    if (!$user) {
      goto('/login');
      return;
    }

    textEditor = new TextEditor('#textEditor', data.organization?.members);
  });

  const submitThread = async () => {
    const { delta, message, mentionedUserIds } = textEditor.getStructuredText();

    const data: ThreadCreateDTO = {
      title: title,
      message: message,
      mentionedUserIds: mentionedUserIds,
      delta: delta,
      snippets: [],
      anonymous: anonymous,
    };

    await apiService.thread.postThread(organizationId, projectId, data);

    goto(projectUrl);
  };

  const goBack = () => {
    window.history.back();
  };
</script>

<div class="flex flex-col gap-y-4 items-center justify-center">
  <div class="flex flex-col gap-y-4 w-full max-w-6xl bg-gray-800 rounded-lg p-6">
    <div class="relative">
      <button
        on:click={goBack}
        class="absolute top-1 right-1 text-gray-300 hover:bg-gray-700 rounded p-1 transition duration-200"
      >
        <Icon icon={closeIcon} class="w-6 h-6" />
      </button>

      <h2 class="text-2xl font-bold text-gray-100">Ask A Question</h2>
    </div>

    <div>
      <div class="block text-gray-400 mb-2">Title</div>
      <input
        type="text"
        bind:value={title}
        placeholder="Enter your thread title"
        class="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none"
      />
    </div>

    <div>
      <div class="block text-gray-400 mb-2">Description</div>
      <div id="textEditor" class="textEditor"></div>
    </div>

    <div class="flex items-center">
      <input type="checkbox" bind:checked={anonymous} id="anonymousCheckbox" class="mr-2" />
      <label for="anonymousCheckbox" class="text-gray-400">Post as anonymous user</label>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
        on:click={submitThread}
      >
        Ask Question
      </button>
    </div>
  </div>
</div>
