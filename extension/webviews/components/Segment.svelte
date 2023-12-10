<script lang="ts">
  import { getContext, onMount } from 'svelte'

  export let label: string = 'Label';
  export let isDisabled: boolean = false;
  export let onClick: ()=>void = () => {};

  let ref:any = null
  let length: number = 0
  let offset: number = 0

  const context: any = getContext('SegmentedControl')
  const index = context.setIndex()
  const selectedSegmentIndex = context.selectedSegmentIndex

  $: isSelected = $selectedSegmentIndex === index

  onMount(() => {
    length = Math.round(ref.clientWidth) 
    offset = Math.round(ref.offsetLeft) 
    
    context.addSegment({ index, isDisabled, length, offset })
  })
  </script>  
  
  
  <button 
    bind:this={ref}
    class='segmented-control-item'
    type='button'
    role='tab'
    aria-selected={isSelected}
    aria-disabled={isDisabled}
    tabindex={isSelected ? 0 : -1}
    {...$$restProps}
    on:click={onClick}
    on:click|preventDefault={() => { 
      if (!isSelected && !isDisabled) {
        context.setSelected(index)
      }
    }}
    on:mouseover
    on:focus
    on:mouseout
    on:blur
    on:mouseenter
    on:mouseleave
  >
    <slot>{label}</slot>
  </button>