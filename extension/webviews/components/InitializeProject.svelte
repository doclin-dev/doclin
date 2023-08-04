<script lang="ts">
    import type { User, Project } from "../types";
    import { onMount } from "svelte";
    export let user: User;
    export let accessToken: string;

    let createProjectName: string = "";
    let githubUrl: string = "";
    let existingProjects: Project[];

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

        console.log(await response.json());
    }

    onMount(async () => {
        const response = await fetch(`${apiBaseUrl}/existingProjects`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

        existingProjects = await response.json();
        console.log(existingProjects);
    });
</script>

<h1>Get Started!</h1>

<div>
    Create a project:

    <form>
        <input placeholder="Enter project name" bind:value={createProjectName} />
        <input placeholder="Github repo url" bind:value={githubUrl} />
        <button on:click|preventDefault={createNewProject}>Submit</button>
    </form>

    <p>or select existing projects:</p>

    <ul>
        <li><a href="#">Existing project 1</a></li>
    </ul>
    
</div>