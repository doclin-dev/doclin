<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let selectedIndex: Writable<number>;

  let segments: any[] = [];
  let indexesIterator: number = -1;
  let backgroundLength: number = 0;
  let backgroundOffset: number = 0;

  $: setSelected($selectedIndex);

  const addSegment = ({
    index,
    isDisabled,
    length,
    offset,
  }: {
    index: number;
    isDisabled: boolean;
    length: number;
    offset: number;
  }) => {
    if (index === $selectedIndex) {
      if (isDisabled) {
        console.warn('Segmented Control: Avoid initially selecting a disabled Segment.');
      }

      backgroundLength = length;
      backgroundOffset = offset;
    }

    segments = [...segments, { index, isDisabled, length, offset }];
  };

  const setSelected = (segmentIndex: number) => {
    if (segmentIndex >= 0 && segmentIndex < segments.length) {
      if (!segments[segmentIndex].isDisabled) {
        backgroundLength = segments[segmentIndex].length;
        backgroundOffset = segments[segmentIndex].offset;
      }
    }
  };

  setContext('SegmentedControl', {
    selectedSegmentIndex: selectedIndex,
    setIndex: () => (indexesIterator += 1),
    addSegment,
  });

  onMount(() => {
    if (segments.length < 2) {
      console.warn('Segmented Control: For the component to function correctly, provide two or more Segments.');
    }
  });
</script>

<div class="segmented-control" role="tablist" tabindex={$selectedIndex ?? -1} {...$$restProps}>
  <slot />
  <div
    class="segmented-control-background"
    role="presentation"
    style="width:{backgroundLength}px; transform: translateX({backgroundOffset}px)"
  ></div>
</div>
