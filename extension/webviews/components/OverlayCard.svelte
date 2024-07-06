<script type="ts">
  import 'bootstrap';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  export let isEditable: boolean = true;
  export let handleEdit: () => void = () => {};
  export let handleDelete: () => void = () => {};
</script>

<div class="dropdown">
  <div class="button dropdown-btn sm" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    <Icon name="context-menu" height={18} />
  </div>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    {#if isEditable}
      <Button title="Edit" onClick={handleEdit} />
      <div class="divider"></div>
    {/if}
    <Button title="Delete" variant="danger" onClick={handleDelete} />
  </ul>
</div>
