<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let input: string = '';
  let messages: string[] = [];

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitPrompt();
    }
  };

  const submitPrompt = () => {
    messages = [`<b>You</b><br>${input}`, ...messages];

    tsvscode.postMessage({
      type: 'copilotPrompt',
      value: input,
    });

    input = '';
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'copilotPrompt':
        const reply = message.value;
        messages = [`<b>Copilot</b><br>${reply}`, ...messages];
        break;
    }
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<form action="" on:keydown={handleKeyDown}>
  <input bind:value={input} placeholder="Type your prompt" />
</form>

<hr />

{#each messages as message, i (i)}
  {@html message}
  <hr />
{/each}
