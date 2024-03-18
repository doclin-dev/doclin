<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Thread as ThreadType } from "../../types";
    import Thread from './Thread.svelte';
    import { ActiveView, Page } from "../../enums";
    import FilterMenu from "../FilterMenu.svelte";
    import { activeView, currentProject, page, reload, threadContents } from "../../state/store";
    import ThreadAddForm from "./ThreadAddForm.svelte";
    
    let threads: Array<ThreadType> = [];
    let activeFilePath: string;

    $: {
        if ($reload > 1) {
            loadThreads();
        }
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
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener)
    });
</script>

<FilterMenu filePath= {activeFilePath} onFirstSegmentClick={loadAllThreads} onSecondSegmentClick={loadCurrentFileThreads}/>

<ThreadAddForm/>

<div id='threads-viewer'>
    {#if threads}
        {#each threads as thread (thread.id)}
            <hr />
            <Thread thread={thread} reloadThreads={loadThreads}/>
        {/each}
        <hr />
    {/if}
</div>