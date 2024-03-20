<script lang="ts">
    import Segment from "./Segment.svelte";
    import SegmentedControl from "./SegmentedControl.svelte";
    import { ActiveView } from "../enums";
    import { activeView, currentOrganization, currentProject } from "../state/store";
  import Icon from "./Icon.svelte";

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

<div>
    <div class="segmentedControlContainer">
        <SegmentedControl selectedIndex={selectedIndex}>
            <Segment onClick={handleFirstSegmentClick}>All Threads</Segment>
            <Segment onClick={handleSecondSegmentClick}>File Threads</Segment>
        </SegmentedControl>
    </div>
    
    <form class="label-holder">
        <label class="filter-menu-label project-label" for="project">
            <div class="overflow-ellipsis">
                {getOrganizationAndProjectName($currentOrganization?.name, $currentProject?.name)}
            </div>
        </label>

        {#if isCurrentFileView}
            <label class="filter-menu-label file-label" for="file">
                <Icon name='file' height={14} width={14}/>
                <div class='overflow-ellipsis'>
                    {filePath}
                </div>
            </label>
        {/if}
    </form>
</div>