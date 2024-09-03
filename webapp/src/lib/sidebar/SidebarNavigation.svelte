<script lang="ts">
  import type { SidebarItemType } from '../../types/SidebarItemType';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import { goto } from '$app/navigation';

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
              <Icon icon={item.arrowIcon || chevronDownIcon} class="h-4 w-4" />
              <span>{item.label}</span>

              {#if item.actions}
                {#each item.actions as action}
                  <button
                    class="ml-auto text-blue-400 hover:text-blue-300"
                    on:click|preventDefault|stopPropagation={() => goto(action.href)}
                  >
                    <Icon icon={action.icon} class="h-5 w-5" />
                  </button>
                {/each}
              {/if}
            </button>
          </div>
          {#if item.isOpen}
            <ul>
              {#each item.subItems as subItem}
                <li>
                  <a href={subItem.href} class="block w-full py-2 px-2 rounded hover:bg-gray-700 text-sm">
                    {subItem.label}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <a href={item.href} class="block w-full py-2 px-4 rounded hover:bg-gray-700 text-sm">
            {item.label}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
