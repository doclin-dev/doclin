<script lang="ts">
  import Sidebar from '$lib/Sidebar.svelte';
  import '../app.css';
  import type { SidebarItemType } from '../types/SidebarItemType';

  export const prerender = true;

  const sidebarItems: SidebarItemType[] = [
    {
      label: 'Home',
      href: '/',
    },
  ];
</script>

<div class="flex">
  <Sidebar items={sidebarItems} />
  <div class="flex-1 p-6">
    <slot />
  </div>
</div>
