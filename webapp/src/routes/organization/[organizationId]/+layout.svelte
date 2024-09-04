<script lang="ts">
  import Sidebar from '$lib/sidebar/Sidebar.svelte';
  import { onMount } from 'svelte';
  import type { LayoutData } from './$types';
  import { organization } from '$lib/stores/organization';

  export let data: LayoutData;

  onMount(() => {
    $organization = data.organization;
  });
</script>

<div class="flex">
  <Sidebar />
  <div class="flex-1">
    <slot />
  </div>
</div>
