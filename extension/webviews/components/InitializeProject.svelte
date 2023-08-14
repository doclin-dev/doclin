<script lang="ts">
    import type { Project } from "../types";
    import { onMount } from "svelte";
    import { Page } from "../enums";
    export let accessToken: string;
    export let page: Page;

    let createProjectName: string = "";
    let githubUrl: string = "";
    let existingProjects: Project[] = [];

    const setCurrentProject = (currentProject: Project) => {
        tsvscode.setState({...tsvscode.getState(), currentProject});
        page = Page.ThreadsViewer;
    }

    const createNewProject = async () => {
        const createProjectResponse = await fetch(`${apiBaseUrl}/project`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                name: createProjectName,
                url: githubUrl
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });

        const currentProject = await createProjectResponse.json();

        setCurrentProject(currentProject?.project);
    }

    const fetchExistingProjects = async () => {
        const response = await fetch(`${apiBaseUrl}/existingProjects?githubUrl=${githubUrl}`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

        const json = await response.json();

        existingProjects = json.projects;
    }

    const handleGetGithubUrl = async(url: string) => {
        githubUrl = url;
        const currentProject: Project = tsvscode.getState()?.currentProject;

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