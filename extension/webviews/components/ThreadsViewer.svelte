<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { User, Thread as ThreadType } from "../types";
    import Thread from './Thread.svelte';
    import { TextEditor } from "./TextEditor";
    import { ActiveTextEditor, ActiveView, Page } from "../enums";
    import FilterMenu from "./FilterMenu.svelte";
    import { activeTextEditor, activeView, currentOrganization, currentProject, page, reload, threadContents } from "../state/store";
    import Button from "./Button.svelte";
    
    let quillEditor: TextEditor;
    let threads: Array<ThreadType> = [];
    let anonymousCheck: boolean = false;
    let activeFilePath: string;
    let organizationUsers: User[] | undefined = $currentOrganization?.members;
    let title: string;

    $: {
        if ($reload > 1) {
            loadThreads();
        }
    }

    async function submitThreadMessage() {
        const { delta, message: threadMessage, snippets, mentionedUserIds } = quillEditor.getStructuredText();

        if (threadMessage) {
            tsvscode.postMessage({ 
                type: "postThread", 
                value: {
                    delta: delta,
                    title: title,
                    threadMessage: threadMessage,
                    snippets: snippets,
                    projectId: $currentProject?.id,
                    mentionedUserIds: mentionedUserIds,
                    anonymous: anonymousCheck ? true : false
                }
            });
        }

        quillEditor.setText("");
        $threadContents = null;
    }

    async function initializeQuillEditor() {
        quillEditor = new TextEditor('#textEditor', organizationUsers);
        $activeTextEditor = ActiveTextEditor.ThreadsViewerTextEditor;

        quillEditor.setContents($threadContents);

        quillEditor.setActiveEditor(ActiveTextEditor.ThreadsViewerTextEditor);

        quillEditor.onTextChange(() => {
            $threadContents = quillEditor.getContents();
        });
    }

    const loadThreads = () => {
        $activeView === ActiveView.CurrentFileThreads ? loadCurrentFileThreads() : loadAllThreads();
    }

    const loadCurrentFileThreads = () => {
        if ($currentProject) {
            tsvscode.postMessage({ type: 'getThreadsByActiveFilePath', value: { currentProjectId: $currentProject.id } });
        }
    }

    const loadAllThreads = () => {
        if ($currentProject) {
            tsvscode.postMessage({ type: 'getAllThreads', value: { currentProjectId: $currentProject.id } });
        }
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateCodeSnippet":
                if ($activeTextEditor === ActiveTextEditor.ThreadsViewerTextEditor) {
                    quillEditor.insertCodeSnippet(message.value);
                }
                break;
            case "getThreadsByActiveFilePath":
                const {threads: threadsByFile, activeFilePath: filePath} = message.value;
                threads = threadsByFile;
                activeFilePath = filePath;
                break;
            case "getAllThreads":
                threads = message.value;
                break;
            case "postThread":
                threads = [message.value, ...threads];
                break;
            case "switchActiveEditor":
                if ($activeView === ActiveView.CurrentFileThreads){
                    loadCurrentFileThreads();
                }
                break;
        }
    }

    onMount(async () => {
        if ($currentProject === null) {
            $page = Page.InitializeProject;
        }

        window.addEventListener("message", messageEventListener);
        loadThreads();
        initializeQuillEditor();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener)
    });
</script>

<div id="textEditorContainer">
    <FilterMenu filePath= {activeFilePath} onFirstSegmentClick={loadAllThreads} onSecondSegmentClick={loadCurrentFileThreads}/>

    <form
        on:submit|preventDefault={submitThreadMessage}>
        <input class="my-1" placeholder="Title" bind:value={title} />
        <div id="textEditor" class="textEditor"></div>
        <div id="submitContainer">
            <button on:click|preventDefault={submitThreadMessage}>Submit</button>
            <label class="checkbox">
                <input type="checkbox" bind:checked={anonymousCheck}>
                Post as an anonymous user
            </label>
        </div>
    </form>
</div>

<div id='threads-viewer'>
    {#if threads}
        {#each threads as thread (thread.id)}
            <hr />
            <Thread thread={thread} reloadThreads={loadThreads}/>
        {/each}
        <hr />
    {/if}
</div>