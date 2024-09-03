<script lang="ts">
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import { goto } from '$app/navigation';
  import type { SidebarItemType } from '../../types/SidebarItemType';

  export let item: SidebarItemType;
  export let toggleCollpase;
  export let index: number;

  const onItemClick = () => {
    if (item.subItems) {
      toggleCollpase(index);
    } else if (item.href) {
      goto(item.href);
    }
  };
</script>

<li>
  <div class="flex items-center">
    <button
      class="flex items-center w-full py-2 pr-2 rounded hover:bg-gray-700 text-sm text-left group {item.subItems
        ? ''
        : 'px-4'}"
      on:click={onItemClick}
    >
      {#if item.subItems}
        <Icon icon={item.arrowIcon || chevronDownIcon} class="h-4 w-4 opacity-0 group-hover:opacity-100" />
      {/if}
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
    <ul class="pl-2">
      {#if item.subItems}
        {#each item.subItems as subItem}
          <li>
            <a href={subItem.href} class="block w-full py-2 px-4 rounded hover:bg-gray-700 text-sm">
              {subItem.label}
            </a>
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</li>
