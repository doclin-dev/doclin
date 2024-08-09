<script type="ts">
  import 'bootstrap';
  import Icon from './Icon.svelte';

  export let options: { key: string; label: string; handler: () => void; className?: string }[] = [];
</script>

<div class="dropdown">
  <div class="button dropdown-btn sm" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    <Icon name="context-menu" height={18} />
  </div>
  <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
    {#each options as option (option.key)}
      <a class="dropdown-item {option.className}" href="/" on:click={option.handler}>{option.label}</a>
    {/each}
  </ul>
</div>
