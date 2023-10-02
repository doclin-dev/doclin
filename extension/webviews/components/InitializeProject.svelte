<script lang="ts">
    import type { Organization, Project } from "../types";
    import { onMount, onDestroy } from "svelte";
    import { Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";

    export let page: Page;

    let postProjectName: string = "";
    let githubUrl: string = "";
    let existingProjects: Project[] = [];
    let currentOrganization: Organization | null;

    const switchPageToThreadsViewer = () => {
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, Page.ThreadsViewer);
    }

    const addCurrentProjectToState = (project: Project) => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, project);
    }

    const setCurrentProject = (project: Project) => {
        tsvscode.postMessage({ type: 'setCurrentProject', value: project.id });
        addCurrentProjectToState(project)
    }

    const createNewProject = async () => {
        tsvscode.postMessage({ type: 'postProject', value: { name: postProjectName } });
    }

    const fetchExistingProjects = async () => {
        tsvscode.postMessage({ type: 'getExistingProjects', value: undefined });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "postProject":
                addCurrentProjectToState(message.value);
                switchPageToThreadsViewer();
                break;
            case "getExistingProjects":
                existingProjects = message.value;
                break;
            case "setCurrentProject":
                switchPageToThreadsViewer();
                break;
        }
    }

    const chooseAnotherOrganization = () => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_ORGANIZATION, null);
        page = Page.InitializeOrganization;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        githubUrl = WebviewStateManager.getState(WebviewStateManager.type.GITHUB_URL);
        currentOrganization = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_ORGANIZATION);
        fetchExistingProjects();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div>
    <h3>Join Project</h3>

    <form>
        <input placeholder="Enter project name" bind:value={postProjectName} />
        <input placeholder="Github repo url" value={githubUrl} disabled/>
        <button on:click|preventDefault={createNewProject}>Create New Project</button>
    </form>

    {#if existingProjects.length > 0}
        <p>Or select an existing project:</p>

        <ul>
            {#each existingProjects as project (project.id)}
                <li >
                    <a href="0" on:click|preventDefault={() => setCurrentProject(project)}> {project.name} </a>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<button on:click={() => {chooseAnotherOrganization()}}>Organization: {currentOrganization?.name}</button>