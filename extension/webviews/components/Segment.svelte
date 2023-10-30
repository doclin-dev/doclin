<script lang="ts">
    import { getContext, onMount } from 'svelte'
  
    export let label: string = 'Label';
    export let isDisabled: boolean = false;
    export let onClick: ()=>void = () => {};
  
    let ref:any = null
    let length: number = 0
    let offset: number = 0
  
    const context: any = getContext('SegmentedControl')
    const orientation = context.orientation
    const index = context.setIndex()
    const focusedSegmentIndex = context.focusedSegmentIndex
    const selectedSegmentIndex = context.selectedSegmentIndex
    
    $: isFocused = $focusedSegmentIndex === index
    $: if (isFocused) { ref?.focus() }
    $: isSelected = $selectedSegmentIndex === index

    const hello =() => {
        console.log("hello");
    }
    
    onMount(() => {
      if (orientation === 'horizontal') {
        length = Math.round(ref.clientWidth) 
        offset = Math.round(ref.offsetLeft) 
      } else if (orientation === 'vertical') {
        length = Math.round(ref.clientHeight) 
        offset = Math.round(ref.offsetTop) 
      }
      
      context.addSegment({ index, isDisabled, length, offset })
      onClick()
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
      if (index !== $selectedSegmentIndex && !isDisabled) {
        context.setSelected(index)
      }
    }}
    on:mouseover
    on:focus
    on:mouseout
    on:blur
    on:mouseenter
    on:mouseleave
    on:keydown
    on:keydown='{({ key }) => {
      if (orientation === 'horizontal' && key === 'ArrowRight' || 
          orientation === 'vertical' && key === 'ArrowDown') {
        context.setSelected(index + 1)
      } else if (
          orientation === 'horizontal' && key === 'ArrowLeft' || 
          orientation === 'vertical' && key === 'ArrowUp') {
        context.setSelected(index - 1)
      }
    }}'
  >
    <slot>{label}</slot>
  </button>