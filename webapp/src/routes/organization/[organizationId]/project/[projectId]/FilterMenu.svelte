<script lang="ts">
  import Icon from '@iconify/svelte';
  import sortIcon from '@iconify/icons-mdi/sort';
  import { onDestroy, onMount } from 'svelte';

  let selectedFilter = 'all';
  let isDropdownOpen = false;
  let dropdown: HTMLElement;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function handleFilterChange(filter: string) {
    // TODO: Complete filter
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdown && !dropdown.contains(event.target as Node)) {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="flex justify-between items-center space-x-2 pb-2" bind:this={dropdown}>
  <div class="flex space-x-2">
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'all' ? 'bg-blue-400 text-white' : 'bg-gray-600  hover:bg-gray-700 text-gray-300'}`}
      on:click={() => handleFilterChange('all')}
    >
      All
    </button>
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'questions' ? 'bg-blue-400 text-white' : 'bg-gray-600  hover:bg-gray-700 text-gray-300'}`}
      on:click={() => handleFilterChange('questions')}
    >
      Questions
    </button>
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'articles' ? 'bg-blue-400 text-white' : 'bg-gray-600  hover:bg-gray-700 text-gray-300'}`}
      on:click={() => handleFilterChange('articles')}
    >
      Articles
    </button>
  </div>

  <div class="relative">
    <button
      class="flex items-center text-sm bg-gray-600 text-gray-300 px-3 py-1 rounded-md hover:bg-gray-700"
      on:click={toggleDropdown}
    >
      <Icon icon={sortIcon} class="mr-1" />
      Sort & Filter
    </button>
    {#if isDropdownOpen}
      <div class="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md z-10 text-sm">
        <ul>
          <li>
            <button class="block w-full text-left px-4 py-2 hover:bg-gray-800"> Sort by Date </button>
          </li>
          <li>
            <button class="block w-full text-left px-4 py-2 hover:bg-gray-800"> Sort by Popularity </button>
          </li>
          <li>
            <button class="block w-full text-left px-4 py-2 hover:bg-gray-800"> Filter by Category </button>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
