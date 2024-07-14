<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Button from '../Button.svelte';
  import { FormEventHandler } from 'svelte/elements';

  let input: string = '';
  let messages: string[] = [];
  let disableSubmit: boolean = false;
  let referToDoclinThreads: boolean = true;
  let referToCodeFile: boolean = true;

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  };

  const submitPrompt = () => {
    if (disableSubmit) {
      return;
    }

    disableSubmit = true;
    messages = [...messages, `<b>You</b><br>${input}`];

    tsvscode.postMessage({
      type: 'copilotPrompt',
      value: {
        prompt: input,
        referToDoclinThreads: referToDoclinThreads,
        referToCodeFile: referToCodeFile
      },
    });

    input = '';
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'copilotPrompt':
        const reply = message.value;
        messages = [...messages, `<b>Copilot</b><br>${reply}`];
        disableSubmit = false;
        break;
    }
  };

  const autoResizeTextarea: FormEventHandler<HTMLTextAreaElement> = (event) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<div class="copilot-container">
  <div class="copilot-messages-body">
    {#each messages as message, i (i)}
      {@html message}
      <hr />
    {/each}
  </div>

  <form action="" on:keydown={handleKeyDown}>
    <div class="copilot-input-container">
      <textarea
        bind:value={input}
        placeholder="Type your prompt"
        on:input={autoResizeTextarea}
      />
      <Button icon="send" type="text" on:click={submitPrompt}/>
    </div>

    <div>
      <input type="checkbox" bind:checked={referToDoclinThreads} />
      Refer to doclin threads
    </div>

    <div>
      <input type="checkbox" bind:checked={referToCodeFile} />
      Refer to currently open file
    </div>
  </form>
</div>
