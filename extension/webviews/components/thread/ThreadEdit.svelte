<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '../Button.svelte';
  import { TextEditor } from '../TextEditor';
  import { activeTextEditor, editedThreadId, page } from '../../state/store';
  import { TextEditorType, Page } from '../../enums';

  export let thread: any;
  let title: string = thread.title ?? '';
  let quillThreadEditor: TextEditor | null;

  const onSubmit = async () => {
    if (quillThreadEditor) {
      const { message: threadMessage, snippets, delta } = quillThreadEditor.getStructuredText();

      tsvscode.postMessage({
        type: 'updateThread',
        value: {
          threadId: thread.id,
          title: title,
          threadMessage: threadMessage,
          snippets: snippets,
          delta: delta,
        },
      });

      quillThreadEditor?.removeToolbarTheme();
      quillThreadEditor = null;
      editedThreadId.set(null);
    }
  };

  const onCancel = () => {
    quillThreadEditor?.removeToolbarTheme();
    quillThreadEditor = null;
    editedThreadId.set(null);
    if ($activeTextEditor === null) {
      if ($page === Page.ThreadsViewer) {
        $activeTextEditor = TextEditorType.ThreadsViewerTextEditor;
      } else if ($page === Page.ReplyViewer) {
        $activeTextEditor = TextEditorType.ReplyViewerTextEditor;
      }
    }
  };

  onMount(() => {
    initializeQuillEditor();

    window.addEventListener('message', messageEventListener);
  });

  const initializeQuillEditor = () => {
    quillThreadEditor = new TextEditor('#thread-editor');
    quillThreadEditor.setContents(thread.delta);
    $activeTextEditor = TextEditorType.ThreadTextEditor;
    quillThreadEditor.setTextEditorType(TextEditorType.ThreadTextEditor);
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;

    switch (message.type) {
      case 'populateCodeSnippet':
        if ($activeTextEditor === TextEditorType.ThreadTextEditor && $editedThreadId === thread.id) {
          quillThreadEditor?.insertCodeSnippet(message.value);
        }
        break;
    }
  };
</script>

<div class="textEditorContainer">
  <input class="textEditorTitle" placeholder="Title" bind:value={title} />
  <div id="thread-editor" class="textEditor"></div>
  <div class="thread-editor-footer">
    <Button variant="secondary" size="sm" onClick={onCancel} title="Cancel" />
    <Button variant="primary" size="sm" onClick={onSubmit} title="Submit" />
  </div>
</div>
