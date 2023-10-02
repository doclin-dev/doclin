<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Project, User, Thread as ThreadType } from "../types";
    import Thread from './Thread.svelte';
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import { TextEditor } from "./TextEditor";
    import { ActiveTextEditor, Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";

    export let user: User;
    export let page: Page;
    
    let quillEditor: any;
    let threads: Array<ThreadType> = [];
    let currentProject: Project | null; 

    async function submitThreadMessage() {
        const threadMessage = quillEditor.getText();
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);

        if (threadMessage) {
            tsvscode.postMessage({ 
                type: "postThread", 
                value: {
                    threadMessage: threadMessage,
                    projectId: currentProject?.id
                }
            });
        }

        quillEditor.setText("");
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_MESSAGE, "");
    }

    async function initializeQuillEditor() {
        quillEditor = new TextEditor('#textEditor');

        quillEditor.onTextChange(() => {
            WebviewStateManager.setState(WebviewStateManager.type.THREAD_MESSAGE, quillEditor.getText());
        });
        
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, ActiveTextEditor.ThreadsViewerTextEditor);
        const message = WebviewStateManager.getState(WebviewStateManager.type.THREAD_MESSAGE) || "";
        quillEditor.setText(message);
        quillEditor.setActiveEditor(ActiveTextEditor.ThreadsViewerTextEditor);
    }

    async function loadThreads() {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
        if (currentProject) {
            tsvscode.postMessage({ type: 'getThreadsByActiveFilePath', value: { currentProjectId: currentProject.id } });
        }
    }

    function chooseAnotherProject() {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, null);
        page = Page.InitializeProject;
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateCodeSnippet":
                if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR) === ActiveTextEditor.ThreadsViewerTextEditor) quillEditor.insertCodeSnippet(message.value);
                break;
            case "getThreadsByActiveFilePath":
                threads = message.value;
                break;
            case "postThread":
                threads = [message.value, ...threads];
                break;
            case "switchActiveEditor":
                loadThreads();
                break;
        }
    }

    onMount(async () => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);

        if (currentProject === null) {
            page = Page.InitializeProject;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
        }

        window.addEventListener("message", messageEventListener);

        loadThreads();
        initializeQuillEditor();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener)
    });
</script>

<ViewerTopBar username={user.name}/>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#each threads as thread (thread.id)}
        <Thread thread={thread} bind:page={page} reloadThreads={loadThreads}/>
    {/each}
</div>

<button on:click={() => {chooseAnotherProject()}}>Project: {currentProject?.name}</button>