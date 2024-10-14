<script lang="ts">
  import Icon from '@iconify/svelte';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import { goto } from '$app/navigation';
  import type { SidebarItemType } from '../../types/SidebarItemType';
  import lockIcon from '@iconify/icons-mdi/lock';
  import { page } from '$app/stores';

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
      class="flex items-center w-full py-1.5 my-1 pr-2 rounded text-sm text-left group {item.subItems
        ? ''
        : 'px-4'} {$page.url.pathname.startsWith(item.href || '') ? 'bg-gray-700' : ''}"
      on:click={onItemClick}
    >
      {#if item.subItems}
        <Icon icon={item.arrowIcon || chevronDownIcon} class="h-4 w-4 opacity-0 group-hover:opacity-100" />
      {/if}
      <span>{item.label}</span>

      {#if item.actions}
        {#each item.actions as action}
          <button
            class="ml-auto text-blue-400 hover:text-blue-300 hover:bg-gray-700 p-0.5 rounded"
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
      {#if item.subItems}
        {#each item.subItems as subItem}
          <li>
            <a
              href={subItem.href}
              class="flex items-center w-full py-1.5 my-0.5 pl-6 pr-4 rounded hover:bg-gray-700 text-sm {$page.url.pathname.startsWith(
                subItem.href || ''
              )
                ? 'bg-gray-700'
                : ''}"
            >
              <span>{subItem.label}</span>
              {#if subItem.private}
                <Icon icon={lockIcon} class="ml-2" />
              {/if}
            </a>
          </li>
        {/each}
      {/if}
    </ul>
  {/if}
</li>
