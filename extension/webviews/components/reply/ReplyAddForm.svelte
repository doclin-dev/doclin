<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { TextEditor } from '../TextEditor';
  import { activeTextEditor, currentOrganization, page, replyContents, threadSelected } from '../../state/store';
  import { TextEditorType, Page } from '../../enums';

  let anonymousCheck: boolean = false;
  let quillReplyViewer: TextEditor;
  let organizationUsers = $currentOrganization?.members;

  onMount(async () => {
    if ($threadSelected == null) {
      $page = Page.ThreadsViewer;
      return;
    }

    window.addEventListener('message', messageEventListener);

    initializeQuillEditor();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'populateCodeSnippet':
        if ($activeTextEditor === TextEditorType.ReplyViewerTextEditor) {
          quillReplyViewer.insertCodeSnippet(message.value);
        }
        break;
    }
  };

  async function initializeQuillEditor() {
    quillReplyViewer = new TextEditor('#replyViewerEditor', organizationUsers);
    quillReplyViewer.setContents($replyContents);
    quillReplyViewer.setTextEditorType(TextEditorType.ReplyViewerTextEditor);

    $activeTextEditor = TextEditorType.ReplyViewerTextEditor;

    quillReplyViewer.onTextChange(() => {
      $replyContents = quillReplyViewer.getContents();
    });
  }

  async function postReplyMessage(message: string, snippets: any[], delta: any, mentionedUserIds: number[]) {
    if ($threadSelected) {
      tsvscode.postMessage({
        type: 'postReply',
        value: {
          threadId: $threadSelected.id,
          replyMessage: message,
          anonymous: anonymousCheck ? true : false,
          snippets,
          delta,
          mentionedUserIds,
        },
      });
    }
  }

  const onSubmit = () => {
    const { message: replyMessage, snippets, delta, mentionedUserIds } = quillReplyViewer.getStructuredText();
    postReplyMessage(replyMessage, snippets, delta, mentionedUserIds);
    quillReplyViewer.setText('');
    $replyContents = '';
  };
</script>

<div class="textEditorContainer">
  <form class="mt-2">
    <div id="replyViewerEditor"></div>

    <div id="submitContainer">
      <label class="checkbox">
        <input type="checkbox" bind:checked={anonymousCheck} />
        Post as an anonymous user
      </label>

      <button on:click|preventDefault={onSubmit}>Reply</button>
    </div>
  </form>
</div>
