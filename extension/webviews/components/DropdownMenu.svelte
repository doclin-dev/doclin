<script type="ts">
  import 'bootstrap';
  import Icon from './Icon.svelte';

  export let handleEdit: () => void = () => {};
  export let handleDelete: () => void = () => {};
</script>

<div class="dropdown">
  <div class="button dropdown-btn sm" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    <Icon name="context-menu" height={18} />
  </div>
  <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
    <a class="dropdown-item" href="/" on:click={handleEdit}>Edit</a>
    <a class="dropdown-item text-danger" href="/" on:click={handleDelete}>Delete</a>
  </ul>
</div>
