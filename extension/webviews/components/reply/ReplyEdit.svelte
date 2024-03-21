<script lang='ts'>
    import { TextEditor } from "../TextEditor";
    import { onMount, tick, onDestroy } from 'svelte';
    import { activeTextEditor, editedReplyId, editedThreadId } from '../../state/store';
    import { TextEditorType } from '../../enums';
    import Button from '../Button.svelte';

    export let reply: any;
    let quillReplyCardEditor: TextEditor | null;

    onMount(() => {
        window.addEventListener("message", messageEventListener);
        initializeQuillEditor();
    });

    const initializeQuillEditor = () => {
        quillReplyCardEditor = new TextEditor('#reply-card-editor');
        quillReplyCardEditor.setContents(reply.delta);
        $activeTextEditor = TextEditorType.ReplyTextEditor;
        quillReplyCardEditor.setTextEditorType(TextEditorType.ReplyTextEditor);
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch(message.type) {
            case "populateCodeSnippet":
                if ($activeTextEditor === TextEditorType.ReplyTextEditor && $editedReplyId === reply.id) {
                    quillReplyCardEditor?.insertCodeSnippet(message.value);
                }
                break;
        }
    }

    const onSubmit = async () => {
        if (quillReplyCardEditor) {
            const { message: replyMessage, snippets, delta } = quillReplyCardEditor.getStructuredText();

            updateReplyMessage(replyMessage, snippets, delta);

            quillReplyCardEditor?.removeToolbarTheme();
            quillReplyCardEditor = null;
        }

        editedReplyId.set(null);
    }
    
    const onCancel = () => {
        if (quillReplyCardEditor) {
            quillReplyCardEditor.removeToolbarTheme();
            quillReplyCardEditor = null;
        }

        editedReplyId.set(null);
        $activeTextEditor = TextEditorType.ReplyViewerTextEditor;
    }

    async function updateReplyMessage(message: string, snippets: any[], delta: any) {
        tsvscode.postMessage({
            type: "updateReply",
            value: { 
                replyId: reply.id, 
                replyMessage: message,
                snippets: snippets,
                delta: delta
            }
        });
    }
</script>

<div class='textEditorContainer'>
    <div id="reply-card-editor"></div> 
    <div class='reply-card-footer'>
        <Button variant='secondary' onClick={onCancel} title="Cancel"/>
        <Button variant='secondary' onClick={onSubmit} title="Submit"/>
    </div>
</div>