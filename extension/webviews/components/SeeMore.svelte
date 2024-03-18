<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    export let content: string;
    let showMore = false;
    let textContainer: HTMLElement;
    let seeMoreLink: HTMLAnchorElement;

    onMount(() => {
        if (textContainer.scrollHeight > textContainer.clientHeight) {
            seeMoreLink.style.display = "block";
        }
    });

    onDestroy(() => {
        seeMoreLink.removeEventListener('click', toggleText);
    });

    function toggleText() {
        showMore = !showMore;
        if (showMore) {
            textContainer.style.maxHeight = "none";
            seeMoreLink.textContent = "See less";
        } else {
            textContainer.style.maxHeight = "250px"; // Set your max height here
            seeMoreLink.textContent = "See more";
        }
    }
</script>

<style>
    .text-container {
        max-height: 250px;
        overflow: hidden;
    }

    .see-more {
        display: none;
        outline: none;
    }
</style>

<div class="text-container" bind:this={textContainer}>
    {@html content}
</div>

<a href='/' class='see-more' on:click={toggleText} bind:this={seeMoreLink}>See more</a>

