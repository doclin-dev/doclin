<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User, Thread as ThreadType } from "../types";
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

        if (threadMessage) {
            tsvscode.postMessage({ 
                type: "createThread", 
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
        if (currentProject) {
            tsvscode.postMessage({ type: 'getThreadsByActiveFilePath', value: { currentProjectId: currentProject.id } });
        }
    }

    function chooseAnotherProject() {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, null);
        page = Page.InitializeProject;
    }

    onMount(async () => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populateThreadMessage":
                    populateThreadMessageField(message.value);
                    break;
                case "getThreadsByActiveFilePath":
                    threads = message.value;
                    break;
                case "createThread":
                    threads = [message.value, ...threads];
                    break;
                case "switchActiveEditor":
                    loadThreads();
                    break;
            }
        });

        loadThreads();
        initializeQuillEditor();
    });
</script>

<style>
    #textEditor{
        width: 100%;
        height: 150px;
        resize: both; 
        overflow: auto;
    }
</style>


<ViewerTopBar username={user.name} projectName={currentProject?.name}/>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <div id="textEditor"></div>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<div id='viewer'>
    {#each threads as thread (thread.id)}
        <Thread thread={thread} username={user.name} bind:page={page} reloadThreads={loadThreads}/>
    {/each}
</div>

<button on:click={() => {chooseAnotherProject()}}>Project: {currentProject?.name}</button>