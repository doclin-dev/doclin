<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import Button from '../Button.svelte';
  import { copilotMessages, copilotReferToCodeFile, copilotReferToDoclinThreads } from '../../state/store';
  import { CopilotRole } from '../../enums';

  let input: string = '';
  let disableSubmit: boolean = false;
  let textarea: HTMLTextAreaElement;

  $: autoResizeTextarea(), input;

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const messageEventListener = async (event: Event) => {
    const type = event.data.type;
    const value = event.data.value;
    switch (type) {
      case 'postCopilotPrompt':
        const reply = value;
        $copilotMessages = [
          ...$copilotMessages.slice(0, $copilotMessages.length - 1),
          { role: CopilotRole.ASSISTANT, content: reply },
        ];
        disableSubmit = false;
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    } else if (event.key === 'ArrowUp') {
      retrievePreviousPrompt();
    }
  };

  const submitPrompt = async () => {
    if (disableSubmit || !input) {
      return;
    }

    disableSubmit = true;

    $copilotMessages = [
      ...$copilotMessages,
      { role: CopilotRole.USER, content: input },
      { role: CopilotRole.ASSISTANT, content: 'typing...' },
    ];

    tsvscode.postMessage({
      type: 'postCopilotPrompt',
      value: {
        messages: $copilotMessages.slice(-4, -1),
        referToDoclinThreads: $copilotReferToDoclinThreads,
        referToCodeFile: $copilotReferToCodeFile,
      },
    });

    input = '';
  };

  const retrievePreviousPrompt = () => {
    if (!input) {
      const lastUserMessage = $copilotMessages
        .slice()
        .reverse()
        .find((message) => message.role === CopilotRole.USER);
      if (lastUserMessage) {
        input = lastUserMessage.content;
      }
    }
  };

  const clearCopilotMessageHistory = () => {
    $copilotMessages = [];
  };

  const autoResizeTextarea = async () => {
    await tick();
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
</script>

<div class="textEditorContainer mb-2">
  <form on:submit|preventDefault={submitPrompt} on:keydown={handleKeyDown}>
    <textarea bind:value={input} placeholder="Type your prompt" bind:this={textarea} />
    <div id="submitContainer">
      <div>
        <label class="checkbox">
          <input type="checkbox" bind:checked={$copilotReferToDoclinThreads} />
          Refer to doclin threads
        </label>

        <label class="checkbox">
          <input type="checkbox" bind:checked={$copilotReferToCodeFile} />
          Refer to currently open file
        </label>
      </div>

      <div class="copilot-button-container">
        <Button variant="secondary" icon="trash" onClick={clearCopilotMessageHistory} />
        <Button icon="send" onClick={submitPrompt} />
      </div>
    </div>
  </form>
</div>
