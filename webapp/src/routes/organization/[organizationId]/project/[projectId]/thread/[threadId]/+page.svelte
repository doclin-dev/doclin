<script lang="ts">
  import ReplyCard from './ReplyCard.svelte';
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';
  import type { PageData } from './$types';
  import { TextEditor } from '$lib/TextEditor';
  import { onMount } from 'svelte';
  import type { ReplyCreateDTO } from '$shared/types/ReplyCreateDTO';
  import { apiService } from '$lib/apiService';
  import type { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
  import moment from 'moment';
  import { goto } from '$app/navigation';
  import { error } from '@sveltejs/kit';
  import DropdownMenu from '$lib/components/DropdownMenu.svelte';

  export let data: PageData;
  const thread = data.thread;
  let replies = thread.replies;
  let textEditor: TextEditor;
  let anonymous: boolean;
  let threadCreationTime: string;

  onMount(() => {
    textEditor = new TextEditor('#textEditor', data.organization?.members);
    updateDate();
    setInterval(() => updateDate(), 60000);
  });

  const submitReply = async () => {
    const { delta, message, mentionedUserIds } = textEditor.getStructuredText();

    const dto: ReplyCreateDTO = {
      message: message,
      mentionedUserIds: mentionedUserIds,
      delta: delta,
      snippets: [],
      anonymous: anonymous,
    };

    const reply = await apiService.reply.postReply(data.organizationId, data.projectId, thread.id, dto);
    const replyDTO: ReplyResponseDTO = reply.data;
    replies = [...replies, replyDTO];
    textEditor.setText('');
  };

  const goBack = () => {
    window.history.back();
  };

  const getReplyCountText = (count: number) => {
    if (count > 1) {
      return `${count} replies`;
    } else {
      return `${count} reply`;
    }
  };

  const updateDate = () => {
    threadCreationTime = moment.utc(thread.createdAt).fromNow();
  };

  const editThread = () => {
    // TODO: Handle editing
  };

  const deleteThread = async (threadId: number) => {
    const response = await apiService.thread.deleteThread(data.organizationId, data.projectId, threadId);
    if (response.status === 200) {
      goto(`/organization/${data.organizationId}/project/${data.projectId}`);
    } else {
      error(response.status, 'Could not delete thread');
    }
  };

  const dropdownOptions = [
    { label: 'Edit', action: editThread },
    { label: 'Delete', action: () => deleteThread(thread.id) },
  ];
</script>

<div class="p-6 w-full max-w-6xl m-auto">
  <div class="bg-gray-800 rounded-lg relative">
    <div class="text-right"></div>

    <div class="flex justify-between items-end mb-2 space-x-2">
      <h1 class="text-2xl font-bold">{thread.title}</h1>
      <div class="flex items-center">
        <DropdownMenu options={dropdownOptions} />
        <button on:click={goBack} class="text-gray-300 hover:bg-gray-700 rounded p-1 transition duration-200">
          <Icon icon={closeIcon} class="w-6 h-6" />
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-300"><span class="font-bold">{thread.username}</span> {threadCreationTime}</p>
    <p class="mt-4">{@html thread.message}</p>
  </div>

  <div class="flex items-center mt-6">
    <div class="h-px bg-blue-500 flex-grow"></div>
    <p class="mx-2 text-lg text-blue-500">{getReplyCountText(replies.length)}</p>
    <div class="h-px bg-blue-500 flex-grow"></div>
  </div>

  <div>
    {#each replies as reply}
      <ReplyCard {reply} />
      <hr class="border-gray-700" />
    {/each}
  </div>

  <div class="mt-6 bg-gray-800 rounded-lg">
    <h2 class="text-lg font-semibold mb-2">Post a Reply</h2>
    <div id="textEditor" class="textEditor"></div>
    <div class="flex items-center mt-2">
      <input type="checkbox" bind:checked={anonymous} id="anonymousCheckbox" class="mr-2" />
      <label for="anonymousCheckbox" class="text-gray-400">Post as anonymous user</label>
    </div>
    <div class="flex justify-end">
      <button on:click={submitReply} class="mt-4 bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-500">
        Submit Reply
      </button>
    </div>
  </div>
</div>
