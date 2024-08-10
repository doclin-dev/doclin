<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { copilotMessages } from '../../state/store';
  import CopilotInputForm from './CopilotInputForm.svelte';
  import CopilotMessagesBody from './CopilotMessagesBody.svelte';
  import { ExtensionState } from '../../types';

  let divElement: HTMLDivElement;
  let error: any;
  let projectNotInitialized: boolean = false;

  $: scrollToBottom(divElement), $copilotMessages;

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
    getExtensionState();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const messageEventListener = async (event: Event) => {
    const message = event.data;
    switch (message.type) {
      case 'getExtensionState':
        handleGetExtensionState(message.value);
        break;
    }
  };

  const getExtensionState = () => {
    tsvscode.postMessage({ type: 'getExtensionState', value: null });
  };

  const handleGetExtensionState = (extensionState: ExtensionState) => {
    error = extensionState?.error;
    const organization = extensionState?.organization;
    const project = extensionState?.project;
    const user = extensionState?.user;

    if (!user || !organization || !project || organization && organization?.unauthorized) {
      projectNotInitialized = true;
    } else {
      projectNotInitialized = false;
    }
  }

  const scrollToBottom = async (node: HTMLDivElement) => {
    await tick();
    node.scroll({ top: node.scrollHeight });
  };
</script>

<div class="copilot-container" bind:this={divElement}>
  {#if error}
    <div>Could not reach server. Please try again later!</div>
    <button on:click={getExtensionState}>Reload</button>
  {:else if projectNotInitialized}
    <div>Complete the steps in the main Doclin sidebar before using Copilot.</div>
  {:else}
      <CopilotMessagesBody />
      <CopilotInputForm />
  {/if}
</div>