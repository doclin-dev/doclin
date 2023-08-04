<script lang="ts">
    import type { User, Project } from "../types";
    import { onMount } from "svelte";
    export let user: User;
    export let accessToken: string;

    let createProjectName: string = "";
    let githubUrl: string = "";
    let existingProjects: Project[] = [];

    async function createNewProject() {
        const response = await fetch(`${apiBaseUrl}/project`, {
            method: "POST",
            body: JSON.stringify({
                name: createProjectName,
                url: githubUrl
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
    }

    const fetchExistingProjects = async () => {
        const response = await fetch(`${apiBaseUrl}/existingProjects?githubUrl=${githubUrl}`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

        const json = await response.json();

        existingProjects = json.projects;
        console.log(existingProjects);
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
            <li><a href="#">{project.name}</a></li>
        {/each}
    </ul>
    
</div>