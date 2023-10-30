<script lang="ts">
  import Segment from "./Segment.svelte";
  import SegmentedControl from "./SegmentedControl.svelte";

  export let organizationName: string | null;
  export let projectName: string | null;
  export let fileName: string | null;
  export let onFirstSegmentClick: () => void;
  export let onSecondSegmentClick: () => void;


</script>

<div style="dispaly: flex, flex-direction:column">
    <div class="segmentedControlContainer">
        <SegmentedControl selectedIndex={0}>
            <Segment onClick={onFirstSegmentClick}>All Threads</Segment>
            <Segment onClick={onSecondSegmentClick}>Current File Threads</Segment>
        </SegmentedControl>
    </div>
    <form>
        <label class="organization-label" for="organization">Organization: {organizationName}</label>
        <label class="project-label" for="project">Project: {projectName}</label>
        <label class="ofile-label" for="file">File: {fileName}</label>
    </form>

</div>

<style>
    .segmentedControlContainer {
        display: flex;
        justify-content: center;
    }
</style>