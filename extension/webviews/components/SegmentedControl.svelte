<script lang="ts">
    import { setContext, onMount } from 'svelte'
    import { writable } from 'svelte/store'
  
    export let selectedIndex: number = 0
    
    let focusedSegmentIndex = writable(selectedIndex)
    let selectedSegmentIndex = writable(selectedIndex)
    let segments: any[] = []
    let indexesIterator: number = -1
    let backgroundLength: number = 0
    let backgroundOffset: number = 0
  
    $: selectedIndex = $selectedSegmentIndex
  
    setContext('SegmentedControl', {
      focusedSegmentIndex,
      selectedSegmentIndex,
      setIndex: () => indexesIterator += 1,
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
      style='width:{backgroundLength}px; transform: translateX({backgroundOffset}px)'
    ></div>
  </div>