<script lang="ts">
  import type { SidebarItemType } from '../types/SidebarItemType';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';

  export let sidebarItems: SidebarItemType[] = [];
  export let onItemToggle: (index: number) => void;
  export let onProjectCreate: () => void;
</script>

<nav class="flex-1 p-4">
  <ul>
    {#each sidebarItems as item, i}
      <li class="mb-2">
        {#if item.subItems}
          <div class="flex items-center">
            <button
              class="flex items-center w-full py-2 rounded hover:bg-gray-700 text-sm text-left"
              on:click={() => onItemToggle(i)}
            >
              <Icon icon={item.arrowIcon || chevronDownIcon} class="h-5 w-5" />
              {item.label}

              {#if item.label === 'Projects'}
                <a href="#" class="text-blue-400 hover:text-blue-300" on:click|preventDefault={onProjectCreate}>
                  <Icon icon={plusIcon} class="h-5 w-5" />
                </a>
              {/if}
            </button>
          </div>
          {#if item.isOpen}
            <ul>
              {#each item.subItems as subItem}
                <li>
                  <a href={subItem.href} class="sub-item text-sm">
                    {subItem.label}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <a href={item.href} class="sidebar-item text-sm">
            {item.label}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  .sidebar-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .sidebar-item:hover {
    background-color: #4a5568;
  }

  .sub-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .sub-item:hover {
    background-color: #2d3748;
  }
</style>
