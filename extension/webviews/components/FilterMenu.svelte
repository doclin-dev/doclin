<script lang="ts">
    import Segment from "./Segment.svelte";
    import SegmentedControl from "./SegmentedControl.svelte";
    import Button from "./Button.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import { ActiveView } from "../enums";
    // import { getActiveEditorFilePath } from "../../src/providerHelpers/threadProviderHelper";

    export let organizationName: string | null;
    export let projectName: string | null;
    // export let fileName: string | null;
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

</script>

<div style="dispaly: flex, flex-direction:column">
    <div class="segmentedControlContainer">
        <SegmentedControl selectedIndex={selectedIndex}>
            <Segment onClick={handleFirstSegmentClick}>All Threads</Segment>
            <Segment onClick={handleSecondSegmentClick}>Current File Threads</Segment>
        </SegmentedControl>
    </div>
    <form class="label-holder">
        <div id="orgAndProject">
            <label class="filter-menu-label organization-label" for="organization">Organization: {organizationName}</label>
            <label class="filter-menu-label project-label" for="project">Project: {projectName}</label>
        </div>
        {#if isCurrentFileView}
            <label class="filter-menu-label file-label" for="file">File: Active Text Editor file path</label>
        {/if}
    </form>
</div>