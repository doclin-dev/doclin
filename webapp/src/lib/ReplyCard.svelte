<script lang="ts">
  import DropdownMenu from '$lib/DropdownMenu.svelte';
  import type { ReplyResponseDTO } from '../../../shared/types/ReplyResponseDTO';

  export let reply: ReplyResponseDTO;

  function formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  function editReply() {
    // TODO: Complete this method
  }

  function deleteReply() {
    // TODO: Complete this method
  }

  const dropdownOptions = [
    { label: 'Edit', action: editReply },
    { label: 'Delete', action: deleteReply },
  ];
</script>

<div class="block py-4">
  <div class="flex justify-between items-center">
    <div class="text-xs text-gray-300">
      <span class="font-bold">{reply.username}</span> • {formatDate(reply.createdAt)}
    </div>
    <div class="flex items-center space-x-2">
      <DropdownMenu options={dropdownOptions} />
    </div>
  </div>

  <p class="text-m text-gray-300 mt-2">{@html reply.message}</p>
</div>
