<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Project, User, Thread as ThreadType, Organization } from "../types";
    import Thread from './Thread.svelte';
    import { TextEditor } from "./TextEditor";
    import { ActiveTextEditor, ActiveView, Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";
    import FilterMenu from "./FilterMenu.svelte";

    export let page: Page;
    
    let quillEditor: TextEditor;
    let threads: Array<ThreadType> = [];
    let currentProject: Project; 
    let currentOrganization: Organization;
    let anonymousCheck: boolean = false;
    let activeFilePath: string;
    let organizationUsers: User[] = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_ORGANIZATION).members;

    async function submitThreadMessage() {
        const { delta, message: threadMessage, snippets, mentionedUserIds } = quillEditor.getStructuredText();
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);

        if (threadMessage) {
            tsvscode.postMessage({ 
                type: "postThread", 
                value: {
                    delta: delta, 
                    threadMessage: threadMessage,
                    snippets: snippets,
                    projectId: currentProject?.id,
                    mentionedUserIds: mentionedUserIds,
                    anonymous: anonymousCheck ? true : false
                }
            });
        }

        quillEditor.setText("");
        WebviewStateManager.setState(WebviewStateManager.type.THREAD_CONTENTS, null);
    }

    async function initializeQuillEditor() {
        quillEditor = new TextEditor('#textEditor', organizationUsers);

        quillEditor.onTextChange(() => {
            WebviewStateManager.setState(WebviewStateManager.type.THREAD_CONTENTS, quillEditor.getContents());
        });
        
        WebviewStateManager.setState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR, ActiveTextEditor.ThreadsViewerTextEditor);
        const contents = WebviewStateManager.getState(WebviewStateManager.type.THREAD_CONTENTS);
        quillEditor.setContents(contents);
        quillEditor.setActiveEditor(ActiveTextEditor.ThreadsViewerTextEditor);
    }

    async function loadCurrentFileThreads() {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
        if (currentProject) {
            tsvscode.postMessage({ type: 'getThreadsByActiveFilePath', value: { currentProjectId: currentProject.id } });
        }
    }

    const loadAllThreads = () => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
        if (currentProject) {
            tsvscode.postMessage({ type: 'getAllThreads', value: { currentProjectId: currentProject.id } });
        }
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateCodeSnippet":
                if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_TEXT_EDITOR) === ActiveTextEditor.ThreadsViewerTextEditor) quillEditor.insertCodeSnippet(message.value);
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
                if (WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_VIEW) === ActiveView.CurrentFileThreads){
                    loadCurrentFileThreads();
                }
                break;
        }
    }

    onMount(async () => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
        currentOrganization = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_ORGANIZATION);

        if (currentProject === null) {
            page = Page.InitializeProject;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
        }

        window.addEventListener("message", messageEventListener);

        WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_VIEW) === ActiveView.CurrentFileThreads ? loadCurrentFileThreads() : loadAllThreads();
        initializeQuillEditor();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener)
    });
</script>


<FilterMenu organizationName={currentOrganization?.name} projectName={currentProject?.name} filePath= {activeFilePath} onFirstSegmentClick={loadAllThreads} onSecondSegmentClick={loadCurrentFileThreads}/>

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
            <Thread thread={thread} bind:page={page} reloadThreads={WebviewStateManager.getState(WebviewStateManager.type.ACTIVE_VIEW) === ActiveView.CurrentFileThreads ? loadCurrentFileThreads : loadAllThreads}/>
        {/each}
    {/if}
</div>