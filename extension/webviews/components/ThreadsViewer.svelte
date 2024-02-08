<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { User, Thread as ThreadType } from "../types";
    import Thread from './Thread.svelte';
    import { TextEditor } from "./TextEditor";
    import { ActiveTextEditor, ActiveView, Page } from "../enums";
    import FilterMenu from "./FilterMenu.svelte";
    import { activeTextEditor, activeView, currentOrganization, currentProject, page, threadContents } from "../state/store";
    
    let quillEditor: TextEditor;
    let threads: Array<ThreadType> = [];
    let anonymousCheck: boolean = false;
    let activeFilePath: string;
    let organizationUsers: User[] | undefined = $currentOrganization?.members;

    async function submitThreadMessage() {
        const { delta, message: threadMessage, snippets, mentionedUserIds } = quillEditor.getStructuredText();

        if (threadMessage) {
            tsvscode.postMessage({ 
                type: "postThread", 
                value: {
                    delta: delta, 
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

    async function loadCurrentFileThreads() {
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

        $activeView === ActiveView.CurrentFileThreads ? loadCurrentFileThreads() : loadAllThreads();
        initializeQuillEditor();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener)
    });
</script>

<FilterMenu filePath= {activeFilePath} onFirstSegmentClick={loadAllThreads} onSecondSegmentClick={loadCurrentFileThreads}/>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <label class="checkbox">
        <input type="checkbox" bind:checked={anonymousCheck}>
        Post as an anonymous user
    </label>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#if threads}
        {#each threads as thread (thread.id)}
            <Thread thread={thread} reloadThreads={$activeView === ActiveView.CurrentFileThreads ? loadCurrentFileThreads : loadAllThreads}/>
        {/each}
    {/if}
</div>