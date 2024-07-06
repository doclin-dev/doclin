<script>
  import Icon from '@iconify/svelte';
  import { iconsMap } from './icons';

  export let name;
  export let width = 20;
  export let height = 20;

  const icon = iconsMap[name];
</script>

<span class="icon">
  <Icon {icon} {width} {height} />
</span>
