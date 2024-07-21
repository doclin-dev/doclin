<script lang="ts">
  import { tick } from 'svelte';
  import snarkdown from 'snarkdown';
  import { copilotMessages } from '../../state/store';
  import { CopilotRole } from '../../enums';
  import CopilotInputForm from './CopilotInputForm.svelte';

  let divElement: HTMLDivElement;

  $: scrollToBottom(divElement), $copilotMessages;

  const scrollToBottom = async (node: HTMLDivElement) => {
    await tick();
    node.scroll({ top: node.scrollHeight });
  };
</script>

<div class="copilot-container" bind:this={divElement}>
  <div class="copilot-messages-body">
    {#each $copilotMessages as message}
      {#if message.role === CopilotRole.USER}
        <b>You</b>
        <br />
        {message.content}
      {:else if message.role === CopilotRole.ASSISTANT}
        <b>Copilot</b>
        <br />
        {@html snarkdown(message.content)}
      {/if}
      <hr />
    {/each}
  </div>
  
  <CopilotInputForm/>
</div>
