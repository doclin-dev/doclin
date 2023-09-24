<script type="ts">
    import Icon from './Icon.svelte';
    export let icon = "";
    export let title = "";
    export let onClick: () => void = () => {};
    export let iconWidth = 20;
    export let iconHeight = 20;
    export let size = 'sm';
    export let type = 'submit'; // [text, ]
    export let variant = 'primary'; // [secondary, danger]

    let clicked: boolean;

    $: if (!['sm', 'md'].includes(size)) {
        size = 'sm';
    }

    $: if (!['text', 'submit'].includes(type)) {
        type = 'text';
    }

    $: if (!['primary', 'secondary','danger'].includes(variant)) {
        variant = 'primary';
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            clicked = true;
        }
    }

  </script>
  
  
  
<div class="button {size} {type} {variant}" on:click={onClick} on:keydown={handleKeyPress}>
    {#if icon}
      <span class="icon"><Icon width={iconWidth} height={iconHeight} name={icon}/></span>
    {/if}
    <span>{title}</span>
</div>
  