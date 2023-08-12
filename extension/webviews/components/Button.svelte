<script>
    import Icon from './Icon.svelte';
    export let icon = "";
    export let title = "";
    export let onClick;
    export let size = 'sm';
    export let type = 'submit'; // text without border and 
    export let variant = 'defualt'; // danger for delete button

    $: if (!['sm', 'md'].includes(size)) {
        console.warn("Invalid size prop provided. Use either 'sm' or 'md'. Defaulting to 'md'.");
        size = 'sm';
    }

    $: if (!['text', 'submit'].includes(type)) {
        console.warn("Invalid size prop provided. Use either 'sm' or 'md'. Defaulting to 'md'.");
        type = 'sm';
    }

    $: if (!['default', 'danger'].includes(variant)) {
        console.warn("Invalid size prop provided. Use either 'sm' or 'md'. Defaulting to 'md'.");
        variant = 'default';
    }

  </script>
  
  
  <div
    class="button {size} {type} {variant}"
    on:click={onClick}
  >
    {#if icon}
      <span class="icon"><Icon name={icon}/></span>
    {/if}
    <span>{title}</span>
  </div>


  <style>
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }

    .button:hover {
        cursor: pointer;
        background-color: #726f6f; 
    }

    .button.md {
        padding: 10px;
    }

    .button.sm {
        padding: 5px;
    }

    .button.text {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 5px;
        cursor: pointer;
    }
    .button.submit {
        border: none;
        padding: 5px;
    }

    .button.submit:hover{
        background-color: rgb(7, 104, 239);
        border-radius: 0;
        color: white;
    }

    .button.danger {
        color: red;
        background-color: white;
    }

    .button.danger:hover {
        background-color: rgb(246, 68, 68);
        color: white;
        border-radius: 0;
    }

</style>
  