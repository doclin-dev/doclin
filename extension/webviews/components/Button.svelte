<script>
    import Icon from './Icon.svelte';
    export let icon = "";
    export let title = "";
    export let onClick;
    export let iconWidth = 20;
    export let iconHeight = 20;
    export let size = 'sm';
    export let type = 'submit'; // [text, ]
    export let variant = 'primary'; // [secondary, danger]

    $: if (!['sm', 'md'].includes(size)) {
        size = 'sm';
    }

    $: if (!['text', 'submit'].includes(type)) {
        type = 'sm';
    }

    $: if (!['primary', 'secondary','danger'].includes(variant)) {
        variant = 'primary';
    }

  </script>
  
  
  <div
    class="button {size} {type} {variant}"
    on:click={onClick}
  >
    {#if icon}
      <span class="icon"><Icon width={iconWidth} height={iconHeight} name={icon}/></span>
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
        padding: 0.5rem;
    }

    .button.sm {
        padding: 0.25rem;
    }

    .button.text {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        /* padding: 5px; */
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
    .button.secondary {
        border: 1px solid #908f8f;
        border-radius: 5px;
    }

    .button.secondary:hover {
        background-color: rgb(7, 104, 239);
        color: white;
        border-radius: 5px;
    }

</style>
  