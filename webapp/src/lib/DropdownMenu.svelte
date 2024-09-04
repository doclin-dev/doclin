<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

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
  <button on:click|preventDefault={toggleDropdown} class="text-gray-500 hover:text-gray-700"> ⋮ </button>

  {#if isOpen}
    <ul class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
      {#each options as { label, action }}
        <li>
          <button
            on:click={() => {
              action();
              isOpen = false;
            }}
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
