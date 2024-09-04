<script lang="ts">
  import Icon from '@iconify/svelte';
  import sortIcon from '@iconify/icons-mdi/sort';

  let selectedFilter = 'all';
  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function handleFilterChange(filter: string) {
    selectedFilter = filter;
    // Add logic to filter threads based on `filter` value
  }
</script>

<div class="flex justify-between items-center pb-2">
  <!-- Filter Buttons -->
  <div class="flex space-x-2">
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'all' ? 'bg-blue-400 text-white' : 'bg-gray-600 text-gray-300'}`}
      on:click={() => handleFilterChange('all')}
    >
      All
    </button>
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'questions' ? 'bg-blue-400 text-white' : 'bg-gray-600 text-gray-300'}`}
      on:click={() => handleFilterChange('questions')}
    >
      Questions
    </button>
    <button
      class={`text-sm px-3 py-1 rounded-md ${selectedFilter === 'articles' ? 'bg-blue-400 text-white' : 'bg-gray-600 text-gray-300'}`}
      on:click={() => handleFilterChange('articles')}
    >
      Articles
    </button>
  </div>

  <!-- Sort and Filter Dropdown -->
  <div class="relative">
    <button
      class="flex items-center text-sm bg-gray-600 text-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
      on:click={toggleDropdown}
    >
      <Icon icon={sortIcon} class="mr-1" />
      Sort & Filter
    </button>
    {#if isDropdownOpen}
      <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
        <ul>
          <li>
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Sort by Date
            </button>
          </li>
          <li>
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Sort by Popularity
            </button>
          </li>
          <li>
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Filter by Category
            </button>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
