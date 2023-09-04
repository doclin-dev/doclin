<script lang="ts">
    import type { Project } from "../types";
    import { onMount } from "svelte";
    import { Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";

    export let page: Page;

    let createProjectName: string = "";
    let githubUrl: string = "";
    let existingProjects: Project[] = [];

    const setCurrentProject = (currentProject: Project) => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, currentProject);
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, Page.ThreadsViewer);
    }

    const createNewProject = async () => {
        tsvscode.postMessage({ type: 'createProject', value: { name: createProjectName } });
    }

    const fetchExistingProjects = async () => {
        tsvscode.postMessage({ type: 'getExistingProjects', value: undefined });
    }

    const handleGetGithubUrl = async(url: string) => {
        githubUrl = url;
        const currentProject: Project = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT)?.currentProject;

        if (githubUrl && currentProject) {
            page = Page.ThreadsViewer;
            return;
        }
        
        fetchExistingProjects();
    }

    onMount(async () => {
        tsvscode.postMessage({ type: 'getGithubUrl', value: undefined });

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "getGithubUrl":
                    handleGetGithubUrl(message.value);
                    break;
                case "createProject":
                    setCurrentProject(message.value);
                    break;
                case "getExistingProjects":
                    existingProjects = message.value;
                    break;
            }
        });
    });
</script>

<h1>Get Started!</h1>

{#if githubUrl}
    <div>
        Create a project:

        <form>
            <input placeholder="Enter project name" bind:value={createProjectName} />
            <input placeholder="Github repo url" value={githubUrl} disabled/>
            <button on:click|preventDefault={createNewProject}>Submit</button>
        </form>

        {#if existingProjects.length > 0}
            <p>Or select an existing project:</p>

            <ul>
                {#each existingProjects as project (project.id)}
                    <li >
                        <a href="0" on:click|preventDefault={() => {
                            setCurrentProject(project)
                        }}> {project.name} </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
{:else}
    <div>
        Workspace folder is not a github repository.
    </div>
{/if}