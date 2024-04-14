<script lang="ts">
    import Segment from "./Segment.svelte";
    import SegmentedControl from "./SegmentedControl.svelte";
    import { ActiveView } from "../enums";
    import { activeView, currentOrganization, currentProject } from "../state/store";
    import Icon from "./Icon.svelte";
  import type { Organization, Project } from "../types";

    export let filePath: string | null;

    let isCurrentFileView: boolean;
    let organizationAndProjectName: string;

    $: isCurrentFileView = $activeView === ActiveView.CurrentFileThreads;
    $: organizationAndProjectName = getOrganizationAndProjectName($currentOrganization, $currentProject);
    
    const getOrganizationAndProjectName = (organization: Organization|null, project: Project|null) => {
        const orgName = organization?.name?.split(' ').join('');
        return `${orgName} / ${project?.name}`
    }
</script>

<div>
    <div class="segmentedControlContainer">
        <SegmentedControl selectedIndex={activeView}>
            <Segment>All Threads</Segment>
            <Segment>File Threads</Segment>
        </SegmentedControl>
    </div>
    
    <form class="label-holder">
        <label class="filter-menu-label project-label" for="project" title="{organizationAndProjectName}">
            <div class="overflow-ellipsis">
                {organizationAndProjectName}
            </div>
        </label>

        {#if isCurrentFileView}
            <label class="filter-menu-label file-label" for="file" title="{filePath ?? ''}">
                <Icon name='file' height={14} width={14}/>
                <div class='overflow-ellipsis'>
                    {filePath}
                </div>
            </label>
        {/if}
    </form>
</div>