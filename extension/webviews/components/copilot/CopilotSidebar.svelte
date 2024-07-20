<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import Button from '../Button.svelte';
  import { FormEventHandler } from 'svelte/elements';
  import snarkdown from 'snarkdown';
  import { CopilotMessage } from '../../types';

  let input: string = '';
  let messages: CopilotMessage[] = [];
  let disableSubmit: boolean = false;
  let referToDoclinThreads: boolean = true;
  let referToCodeFile: boolean = true;
  let divElement: HTMLDivElement;

  $: scrollToBottom(divElement), messages;

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
    tsvscode.postMessage({ type: 'getCopilotMessageHistory', value: null });
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const messageEventListener = async (event: Event) => {
    const message = event.data;
    switch (message.type) {
      case 'postCopilotPrompt':
        const reply = message.value;
        messages = [...messages.slice(0, messages.length - 1), {author: 'copilot', message: reply}];
        disableSubmit = false;
        break;
      case 'getCopilotMessageHistory':
        messages = message.value;
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  };

  const submitPrompt = async () => {
    if (disableSubmit || !input) {
      return;
    }

    disableSubmit = true;
    messages = [
      ...messages, 
      { author: 'user', message: input },
      { author: 'copilot', message: 'typing...' }
    ];

    tsvscode.postMessage({
      type: 'postCopilotPrompt',
      value: {
        prompt: input,
        referToDoclinThreads: referToDoclinThreads,
        referToCodeFile: referToCodeFile
      },
    });

    input = '';
  };

  const clearCopilotMessageHistory = () => {
    tsvscode.postMessage({ type: 'clearCopilotMessageHistory', value: null });
    messages = [];
  }

  const autoResizeTextarea: FormEventHandler<HTMLTextAreaElement> = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const scrollToBottom = async (node: HTMLDivElement) => {
    await tick();
    node.scroll({ top: node.scrollHeight });
  }; 
</script>

<div class="copilot-container" bind:this={divElement}>
  <div class="copilot-messages-body">
    {#each messages as message}
      {#if message.author === 'user'}
        <b>You</b>
        <br/>
        {message.message}
      {:else if message.author === 'copilot'}
        <b>Copilot</b>
        <br/>
        {@html snarkdown(message.message)}
      {/if}
      <hr />
    {/each}
  </div>

  <div class="textEditorContainer mb-2">
    <form on:submit|preventDefault={submitPrompt} on:keydown={handleKeyDown}>
      <textarea
        bind:value={input}
        placeholder="Type your prompt"
        on:input={autoResizeTextarea}
      />
      <div id="submitContainer">
        <div>
          <label class="checkbox">
              <input type="checkbox" bind:checked={referToDoclinThreads} />
              Refer to doclin threads
          </label>
          
          <label class="checkbox">
            <input type="checkbox" bind:checked={referToCodeFile} />
            Refer to currently open file
          </label>
        </div>

        <div>
          <Button icon='trash' onClick={clearCopilotMessageHistory} />
          <Button icon='send' onClick={submitPrompt} />
        </div>
      </div>
    </form>
  </div>
  
</div>
