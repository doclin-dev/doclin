<script lang="ts">
    import { onMount } from 'svelte';
    import type { Thread as ThreadType } from '../types';
  import { Page } from '../enums';
  import { page } from '../state/store';

    let searchQuery: string = '';
    let items:Array<string>  = [];

    // Function to filter items based on search query
    function filterItems() {
        return items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Function to handle search query change
    function handleSearchQueryChange(event:any) {
        searchQuery = event.target?.value;
        $page = Page.SearchViewer;
        console.log(searchQuery);
    }

    // Lifecycle hook to initialize items
    onMount(() => {
        // Fetch items from API or set them manually
        items = ['item 1', 'item 2', 'item 3'];
    });
</script>

<div>
    <input type="text" bind:value={searchQuery} on:input={handleSearchQueryChange} placeholder="Search items" />

    <ul>
        {#each filterItems() as item}
            <li>{item}</li>
        {/each}
    </ul>
</div>