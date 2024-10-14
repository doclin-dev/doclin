<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Icon from '@iconify/svelte';
  import dotsHorizontal from '@iconify/icons-mdi/dots-horizontal';

  export let options: { label: string; action: () => void }[] = [];
  let isOpen = false;
  let dropdown: HTMLElement;

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdown && !dropdown.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="relative" bind:this={dropdown}>
  <button
    on:click|preventDefault={toggleDropdown}
    class="flex items-center justify-center text-gray-100 hover:bg-gray-700 rounded w-8 h-8"
  >
    <Icon icon={dotsHorizontal} />
  </button>

  {#if isOpen}
    <ul class="absolute right-0 mt-2 w-20 bg-gray-900 border border-gray-900 rounded-md shadow-lg">
      {#each options as { label, action }}
        <li>
          <button
            on:click|preventDefault={() => {
              action();
              isOpen = false;
            }}
            class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            {label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
