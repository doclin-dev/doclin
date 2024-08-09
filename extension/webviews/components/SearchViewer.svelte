<script lang="ts">
    import { onMount } from 'svelte';
    import type { Thread as ThreadType } from '../types';
    import { Page } from '../enums';
    import { currentProject, page } from '../state/store';
    import Thread from './thread/Thread.svelte';
    import Button from './Button.svelte';

    let searchQuery: string = '';
    let threads: Array<ThreadType> = [];

    const handleSearchQuery = (event: any) => {
        if (event.key === 'Enter') {
            searchQuery = event.target.value;
            if ($currentProject) {
                tsvscode.postMessage({ type: 'searchThreads', value: {searchText: searchQuery, projectId: $currentProject.id} });
            }
        }
    };

    const handleCancelButtonClick = () => {
        searchQuery = '';
        $page = Page.ThreadsViewer;
    };

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case 'searchThreads':
                threads = message.value;
                break;
            };
    };

    onMount(async () => {
        if ($currentProject === null) {
            $page = Page.InitializeProject;
        };
        window.addEventListener('message', messageEventListener);
    });
</script>

<style>
    .search-container{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
</style>
<div>
    <div class="search-container">
        <input class="search-field" type="text" bind:value={searchQuery} on:keydown={handleSearchQuery} placeholder="Search threads" />
        <Button title="Cancel" onClick={handleCancelButtonClick}/>
    </div>
    <div style="padding-top: 0.75rem;">Showing search results: </div>
    {#if threads.length > 0}
        {#each threads as thread (thread.id)}
            <hr />
            <Thread {thread} reloadThreads={() => {}} />
        {/each}
        <hr />
    {/if}
</div>