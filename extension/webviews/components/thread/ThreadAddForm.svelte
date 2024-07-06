<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { activeTextEditor, activeView, currentOrganization, currentProject, threadContents } from '../../state/store';
  import { TextEditor } from '../TextEditor';
  import { TextEditorType, ActiveView } from '../../enums';
  import type { User } from '../../types';

  let quillEditor: TextEditor;
  let anonymousCheck: boolean = false;
  let title: string;
  let organizationUsers: User[] | undefined = $currentOrganization?.members;

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
    initializeQuillEditor();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const preventEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.target as Element)?.nodeName !== 'TEXTAREA') {
      event.preventDefault();
    }
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'populateCodeSnippet':
        if ($activeTextEditor === TextEditorType.ThreadsViewerTextEditor) {
          quillEditor.insertCodeSnippet(message.value);
        }
        break;
    }
  };

  async function initializeQuillEditor() {
    quillEditor = new TextEditor('#textEditor', organizationUsers);
    quillEditor.setContents($threadContents);
    quillEditor.setTextEditorType(TextEditorType.ThreadsViewerTextEditor);

    quillEditor.onTextChange(() => {
      $threadContents = quillEditor.getContents();
    });

    $activeTextEditor = TextEditorType.ThreadsViewerTextEditor;
  }

  async function submitThreadMessage() {
    const { delta, message: threadMessage, snippets, mentionedUserIds } = quillEditor.getStructuredText();

    if (threadMessage) {
      tsvscode.postMessage({
        type: 'postThread',
        value: {
          delta: delta,
          title: title,
          threadMessage: threadMessage,
          snippets: snippets,
          projectId: $currentProject?.id,
          mentionedUserIds: mentionedUserIds,
          anonymous: anonymousCheck ? true : false,
          isFileThreadSelected: $activeView === ActiveView.CurrentFileThreads,
        },
      });
    }

    title = '';
    quillEditor.setText('');
    $threadContents = null;
  }
</script>

<div class="textEditorContainer mb-2">
  <form on:submit|preventDefault={submitThreadMessage} on:keydown={preventEnter}>
    <input class="textEditorTitle" placeholder="Title" bind:value={title} />
    <div id="textEditor" class="textEditor"></div>
    <div id="submitContainer">
      <label class="checkbox">
        <input type="checkbox" bind:checked={anonymousCheck} />
        Post as an anonymous user
      </label>
      <button class="submitButton" on:click|preventDefault={submitThreadMessage}>Submit</button>
    </div>
  </form>
</div>
