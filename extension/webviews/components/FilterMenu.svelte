<script lang="ts">
  import Segment from './Segment.svelte';
  import SegmentedControl from './SegmentedControl.svelte';
  import { ActiveView } from '../enums';
  import { activeView } from '../state/store';

  let isCurrentFileView: boolean;
  $: isCurrentFileView = $activeView === ActiveView.CurrentFileThreads;
</script>

<div class="segmentedControlContainer">
  <SegmentedControl selectedIndex={activeView}>
    <Segment>All Threads</Segment>
    <Segment>File Threads</Segment>
  </SegmentedControl>
</div>
