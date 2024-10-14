<script lang="ts">
  import type { SidebarItemType } from '../../types/SidebarItemType';
  import SidebarNavigationItem from './SidebarNavigationItem.svelte';

  export let sidebarItems: SidebarItemType[] = [];
  export let toggleCollpase: (index: number) => void;
</script>

<nav class="flex-1 p-1">
  <ul>
    {#each sidebarItems as item, index}
      <SidebarNavigationItem {item} {index} {toggleCollpase} />
    {/each}
  </ul>
</nav>
