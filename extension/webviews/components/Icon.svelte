<script lang="ts">
  import Icon from '@iconify/svelte';
  import { iconsMap } from './icons';
  import type { IconifyIcon } from '@iconify/svelte';

  export let name;
  export let width = 20;
  export let height = 20;

  const icon: IconifyIcon = iconsMap[name];
</script>

<span class="icon">
  <Icon {icon} {width} {height} />
</span>
