<script lang="ts">
  import Segment from './Segment.svelte';
  import SegmentedControl from './SegmentedControl.svelte';
  import { activeView } from '../state/store';
</script>

<div class="segmentedControlContainer">
  <SegmentedControl selectedIndex={activeView}>
    <Segment>All Threads</Segment>
    <Segment>File Threads</Segment>
  </SegmentedControl>
</div>
