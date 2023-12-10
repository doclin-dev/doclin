<script lang="ts">
    import Segment from "./Segment.svelte";
    import SegmentedControl from "./SegmentedControl.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import { ActiveView } from "../enums";

    export let organizationName: string | null;
    export let projectName: string | null;
    export let filePath: string | null;
    export let onFirstSegmentClick: () => void;
    export let onSecondSegmentClick: () => void;

    let isCurrentFileView: Boolean = WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_VIEW) === ActiveView.CurrentFileThreads;
    let selectedIndex: number = WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_VIEW) ?? 0;

    const handleFirstSegmentClick = () => {
        onFirstSegmentClick();
        const activeView = ActiveView.AllThreads;
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_VIEW, activeView);
        isCurrentFileView = false;
    }

    const handleSecondSegmentClick = () => {
        onSecondSegmentClick();
        const activeView = ActiveView.CurrentFileThreads;
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_VIEW, activeView);
        isCurrentFileView = true;
    }
    
    const getOrganizationAndProjectName = (organizationName: string | null, projectName: string | null) => {
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
        <label class="filter-menu-label project-label" for="project">{getOrganizationAndProjectName(organizationName, projectName)}</label>
        {#if isCurrentFileView}
            <label class="filter-menu-label file-label" for="file">File: {filePath}</label>
        {/if}
    </form>
</div>