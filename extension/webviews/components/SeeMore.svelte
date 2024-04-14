<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    export let content: string;
    let showMore = false;
    let textContainer: HTMLElement;
    let seeMoreLink: HTMLAnchorElement;
    const SEE_LESS_TEXT: string = 'See less';
    const SEE_MORE_TEXT: string = '...See More';

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
            seeMoreLink.textContent = SEE_LESS_TEXT;
        } else {
            textContainer.style.maxHeight = "125px";
            seeMoreLink.textContent = SEE_MORE_TEXT;
        }
    }
</script>

<style>
    .text-container {
        max-height: 125px;
        overflow: hidden;
    }

    .see-more {
        display: none;
        outline: none;
    }
</style>

<div>
    <div class="text-container" bind:this={textContainer}>
        {@html content}
    </div>
    
    <a href='/' class='see-more' on:click={toggleText} bind:this={seeMoreLink}>{SEE_MORE_TEXT}</a>
</div>