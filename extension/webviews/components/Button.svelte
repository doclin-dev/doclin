<script type="ts">
  import Icon from './Icon.svelte';
  export let icon = '';
  export let title = '';
  export let onClick: () => void = () => {};
  export let iconWidth = 20;
  export let iconHeight = 20;
  export let size = 'sm';
  export let type = 'submit';
  export let variant = 'primary';
  export let textAlignment = 'center';
  export let children: string = '';
  export let childrenClassName: string = '';

  $: if (!['sm', 'md'].includes(size)) {
    size = 'sm';
  }

  $: if (!['text', 'submit'].includes(type)) {
    type = 'text';
  }

  $: if (!['primary', 'secondary', 'danger'].includes(variant)) {
    variant = 'primary';
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onClick();
    }
  }
</script>

<div
  class="button {size} {type} {variant}"
  style="justify-content: {textAlignment}"
  on:click={onClick}
  on:keydown={handleKeyPress}
>
  {#if icon}
    <span class="icon"><Icon width={iconWidth} height={iconHeight} name={icon} /></span>
  {/if}
  <span>{title}</span>
  {#if children}
    <span class="buttonChild {childrenClassName}">{children}</span>
  {/if}
</div>
