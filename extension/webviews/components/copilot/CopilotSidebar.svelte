<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { copilotMessages } from '../../state/store';
  import CopilotInputForm from './CopilotInputForm.svelte';
  import CopilotMessagesBody from './CopilotMessagesBody.svelte';
  import { ExtensionState } from '../../types';

  let divElement: HTMLDivElement;
  let error: any;
  let isUnauthenticated: boolean = true;
  let isUnauthorized: boolean = true;

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

    isUnauthenticated = !user;
    isUnauthorized = !organization || !project || !!organization?.unauthorized || !!project?.unauthorized;
  };

  const scrollToBottom = async (node: HTMLDivElement) => {
    await tick();
    if (node) {
      node.scroll({ top: node.scrollHeight });
    }
  };

  const authenticate = () => {
    tsvscode.postMessage({ type: 'authenticate', value: undefined });
  };
</script>

<div class="copilot-container" bind:this={divElement}>
  {#if error}
    <div>Could not reach server. Please try again later!</div>
    <button on:click={getExtensionState}>Reload</button>
  {:else if isUnauthenticated}
    <button on:click={authenticate}>Login</button>
  {:else if isUnauthorized}
    <div>Complete the steps in the main Doclin sidebar before using Copilot.</div>
  {:else}
    <CopilotMessagesBody />
    <CopilotInputForm />
  {/if}
</div>
