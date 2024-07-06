<script lang="ts">
  export let displayMessage: string;
  let expanded = false;
  const PRE_TAG = /<pre\b[^>]*>[\s\S]*?<\/pre>/gi;
  const COLLAPSED_TEXT = '...';

  const toggleExpand = () => {
    expanded = !expanded;
  };

  const getCollapsedText = (displayMessage: string) => {
    return displayMessage.replace(PRE_TAG, COLLAPSED_TEXT);
  };
</script>

<div>
  {#if expanded}
    <p>{@html displayMessage}</p>
  {:else}
    <p class="show-less-container">{@html getCollapsedText(displayMessage)}</p>
  {/if}
</div>

{#if !expanded && displayMessage.length > 125}
  <p class="show-more" on:click={toggleExpand} on:keydown={toggleExpand}>...See more</p>
{/if}

{#if expanded}
  <p class="show-more" on:click={toggleExpand} on:keydown={toggleExpand}>Show less</p>
{/if}
