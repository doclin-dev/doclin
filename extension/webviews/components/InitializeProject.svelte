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

    onMount(async () => {
        tsvscode.postMessage({ type: 'getGithubUrl', value: undefined });

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "getGithubUrl":
                    githubUrl = message.value;
                    fetchExistingProjects();
                    break;
            }
        });        
    });
</script>

<h1>Get Started!</h1>

<div>
    Create a project:

    <form>
        <input placeholder="Enter project name" bind:value={createProjectName} />
        <input placeholder="Github repo url" value={githubUrl} disabled/>
        <button on:click|preventDefault={createNewProject}>Submit</button>
    </form>

    <p>or select existing projects:</p>

    <ul>
        {#each existingProjects as project (project.id)}
            <li >
                <a href="0" on:click|preventDefault={() => {
                    console.log(project);
                    setCurrentProject(project)
                }}> {project.name} </a>
            </li>
        {/each}
    </ul>
</div>