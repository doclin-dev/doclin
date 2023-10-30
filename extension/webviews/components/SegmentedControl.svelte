<script lang="ts">
    import { setContext, onMount } from 'svelte'
    import { writable } from 'svelte/store'
  
    export let selectedIndex: number = 0
    export let orientation: string = 'horizontal' // Options: horizontal/vertical
    
    let focusedSegmentIndex = writable(selectedIndex)
    let selectedSegmentIndex = writable(selectedIndex) // Selected Segment is one that is focused and not disabled
    let segments: any[] = []
    let indexesIterator: number = -1
    let backgroundLength: number = 0
    let backgroundOffset: number = 0
  
    $: selectedIndex = $selectedSegmentIndex
  
    setContext('SegmentedControl', {
      orientation,
      focusedSegmentIndex,
      selectedSegmentIndex,
      setIndex: () => {
        indexesIterator += 1
        return indexesIterator
      },
      addSegment: ({ index, isDisabled, length, offset }: {index:number, isDisabled: boolean, length: number, offset: number}) => {
        if (index === $selectedSegmentIndex) {
          if (isDisabled) {
            console.warn('Segmented Control: Avoid initially selecting a disabled Segment.')
          }
  
          backgroundLength = length
          backgroundOffset = offset
        }
        segments = [...segments, { index, isDisabled, length, offset }]
      },
      setSelected: (segmentIndex: number) => {
        if (segmentIndex >= 0 && segmentIndex < segments.length) {
          $focusedSegmentIndex = segmentIndex
  
          if (!segments[segmentIndex].isDisabled) {
            $selectedSegmentIndex = $focusedSegmentIndex
  
            backgroundLength = segments[$selectedSegmentIndex].length
            backgroundOffset = segments[$selectedSegmentIndex].offset
          }
        }
      }
    })
  
    onMount(() => {
      if (segments.length < 2) {
        console.warn('Segmented Control: For the component to function correctly, provide two or more Segments.')
      }
  
      if (orientation !== 'horizontal' && orientation !== 'vertical') {
        console.error(`Segmented Control: Accepted orientation types are "horizontal" and "vertical". Provided "${orientation}".`)
      }
    })
  </script>
  
  
  <div 
    class='segmented-control' 
    role='tablist'
    tabindex={selectedIndex ?? -1}
    {...$$restProps}
    on:click
    on:mouseover
    on:mouseenter
    on:focus
    on:mouseout
    on:mouseleave
    on:blur
  >
    <slot />
    <div 
      class='segmented-control-background' 
      role='presentation' 
      style='
        {orientation === 'vertical' ? 'height' : 'width'}: {backgroundLength}px; 
        transform: translate{orientation === 'vertical' ? 'Y' : 'X'}({backgroundOffset}px)'
    ></div>
  </div>