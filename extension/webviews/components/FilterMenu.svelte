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
            <label class="organization-label" for="organization">Organization: {organizationName}</label>
            <label class="project-label" for="project">Project: {projectName}</label>
        </div>
        {#if isCurrentFileView}
            <label class="file-label" for="file">File: Active Text Editor file path</label>
        {/if}
    </form>

</div>

<style>
    .segmentedControlContainer {
        display: flex;
        justify-content: center;
        padding: 0.25rem;
    }
    .label-holder {
        display: flex;
        flex-direction: column;
        /* justify-content: flex-start; */
        gap: 0.25rem;
        padding: 0.25rem;
        font-size: 15px;  
    }

    #orgAndProject {
        display: flex;
        justify-content: flex-start;
        gap: 0.25rem;
    }
    label {
        white-space: nowrap;
        overflow: hidden;  
        text-overflow: ellipsis; 
        cursor: pointer;
        border: #898787;
        border-radius: 0.5rem;
        background-color: beige;
        color: brown;
        padding: 0 0.5rem;
    }
    .organization-label:hover::after {
        white-space: normal; 
        overflow: visible;
        z-index: 999; 
        position: absolute; 
        background-color: #898787; 
        padding: 0.5rem;
        color: black;
        font-size: 14px;
        position: absolute;
        bottom: 100%;
        left: 50%;
    }
</style>