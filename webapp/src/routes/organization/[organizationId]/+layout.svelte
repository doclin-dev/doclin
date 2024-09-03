<script lang="ts">
  import Sidebar from '$lib/Sidebar.svelte';
  import type { SidebarItemType } from '../../../types/SidebarItemType';
</script>

<div class="flex">
  <Sidebar />
  <div class="flex-1">
    <slot />
  </div>
</div>
