<script>
    // import 'bootstrap';
    import Button from './Button.svelte';
    import Icon from './Icon.svelte';

    export let handleEdit;
    export let handleDelete;
  
  </script>
  
  <style>
    /* @import "./custom.scss"; */

    .btn {
        border: none;
        padding: 0 0.25rem;
        align-items: center;
    }

    .dropdown{
        padding: 0 0.5rem;
    }

    .dropdown-menu {
        font-weight: 400;
        min-width: 6rem;
        padding: 0.25rem 0;
    }

    .divider {
        height: 1px;
        background-color: #c3c0c0;
    }
  </style>
  
  <div class="dropdown">
    <button class="btn btn-secondary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      <Icon name="context-menu" height={18}/>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <Button title="Edit" onClick={handleEdit}/>
      <div class="divider"></div>
      <Button title="Delete" variant="danger" onClick={handleDelete}/>
    </ul>
  </div>

  