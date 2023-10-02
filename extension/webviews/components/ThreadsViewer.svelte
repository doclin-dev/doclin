<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Project, User, Thread as ThreadType, Organization } from "../types";
    import Quill from "quill";
    import Thread from './Thread.svelte';
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import { Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";

    export let user: User;
    export let page: Page;
    
    let quillEditor: any;
    let threads: Array<ThreadType> = [];
    let currentProject: Project | null;
    let currentOrganization: Organization | null;

    async function populateThreadMessageField({ filePath, threadMessage }: { filePath: string, threadMessage: string }) {
        const selection = quillEditor.getSelection(true);
        const cursorPosition: number = selection ? selection.index : quillEditor.getLength();
        const textToInsert = `File Path: ${filePath}\n${threadMessage}\n`;

        quillEditor.insertText(cursorPosition, "\n");
        quillEditor.insertText(cursorPosition + 1, textToInsert);
        quillEditor.formatText(cursorPosition + 1, textToInsert.length, "code-block", true);
        quillEditor.insertText(cursorPosition + 1 + textToInsert.length, "\n");
        quillEditor.setSelection(cursorPosition + 1 + textToInsert.length);
    }

    async function submitThreadMessage() {
        const threadMessage = quillEditor.root.innerHTML;
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
        quillEditor = new Quill('#textEditor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'blockquote', 'code-block', 'image'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ color: [] }, { background: [] }]
                ]
            },
            theme: 'snow'
        });   
        
        quillEditor.theme.modules.toolbar.container.style.background = '#f1f1f1';
        quillEditor.theme.modules.toolbar.container.style.border = 'none';

        quillEditor.on('text-change', () => {
            WebviewStateManager.setState(WebviewStateManager.type.THREAD_MESSAGE, quillEditor.root.innerHTML);
        });
        
        quillEditor.root.innerHTML = WebviewStateManager.getState(WebviewStateManager.type.THREAD_MESSAGE) || "";
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
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const chooseAnotherOrganization = () => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_ORGANIZATION, null);
        page = Page.InitializeOrganization;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "populateThreadMessage":
                populateThreadMessageField(message.value);
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
        currentOrganization = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_ORGANIZATION);

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
<button on:click={() => {chooseAnotherOrganization()}}>Organization: {currentOrganization?.name}</button>