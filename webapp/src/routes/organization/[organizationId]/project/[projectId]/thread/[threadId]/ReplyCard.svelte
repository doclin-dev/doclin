<script lang="ts">
  import DropdownMenu from '$lib/components/DropdownMenu.svelte';
  import type { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
  import moment from 'moment';
  import { onMount } from 'svelte';

  export let reply: ReplyResponseDTO;
  let replyCreationTime: string;

  onMount(() => {
    updateDate();
    setInterval(() => updateDate(), 60000);
  });

  const editReply = () => {
    // TODO: Complete this method
  };

  const deleteReply = () => {
    // TODO: Complete this method
  };

  const dropdownOptions = [
    { label: 'Edit', action: editReply },
    { label: 'Delete', action: deleteReply },
  ];

  const updateDate = () => {
    replyCreationTime = moment.utc(reply.createdAt).fromNow();
  };
</script>

<div class="block py-4">
  <div class="flex justify-between items-center">
    <div class="text-xs text-gray-300">
      <span class="font-bold">{reply.username}</span> • {replyCreationTime}
    </div>
    <div class="flex items-center space-x-2">
      <DropdownMenu options={dropdownOptions} />
    </div>
  </div>

  <p class="text-m text-gray-300 mt-2">{@html reply.message}</p>
</div>
