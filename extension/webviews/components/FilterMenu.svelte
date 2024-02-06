<script lang="ts">
    import Segment from "./Segment.svelte";
    import SegmentedControl from "./SegmentedControl.svelte";
    import { ActiveView } from "../enums";
    import { activeView, currentOrganization, currentProject } from "./store";

    export let filePath: string | null;
    export let onFirstSegmentClick: () => void;
    export let onSecondSegmentClick: () => void;

    let isCurrentFileView: boolean;
    let selectedIndex: number;

    $: {
        isCurrentFileView = $activeView === ActiveView.CurrentFileThreads;
        selectedIndex = $activeView ?? 0;
    }

    const handleFirstSegmentClick = () => {
        onFirstSegmentClick();
        $activeView = ActiveView.AllThreads;
    }

    const handleSecondSegmentClick = () => {
        onSecondSegmentClick();
        $activeView = ActiveView.CurrentFileThreads;
    }
    
    const getOrganizationAndProjectName = (organizationName: string | undefined, projectName: string | undefined) => {
        const orgName = organizationName?.split(' ').join('');
        return `${orgName} / ${projectName}`
    }
</script>

<div style="dispaly: flex, flex-direction:column">
    <div class="segmentedControlContainer">
        <SegmentedControl selectedIndex={selectedIndex}>
            <Segment onClick={handleFirstSegmentClick}>All Threads</Segment>
            <Segment onClick={handleSecondSegmentClick}>File Threads</Segment>
        </SegmentedControl>
    </div>
    <form class="label-holder">
        <label class="filter-menu-label project-label" for="project">{getOrganizationAndProjectName($currentOrganization?.name, $currentProject?.name)}</label>
        {#if isCurrentFileView}
            <label class="filter-menu-label file-label" for="file">File: {filePath}</label>
        {/if}
    </form>
</div>