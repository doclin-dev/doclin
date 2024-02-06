<script lang="ts">
    import type { Organization, Project } from "../types";
    import { onMount, onDestroy } from "svelte";
    import { Page } from "../enums";
    import { currentOrganization, currentProject, githubUrl, page } from "./store";

    let postProjectName: string = "";
    let existingProjects: Project[] = [];
    let error: string = "";
    let newProjectView: boolean;
    
    const EMPTY_STRING_ERROR: string = "Project name cannot be empty!";
    const CREATE_NEW_PROJECT: string = "Create New project";
    const JOIN_EXISTING_PROJECT: string = "Join Existing Project";
    const INITIALIZE_MESSAGE: string = "This will update your '.doclin' file with your project details."

    const setCurrentProject = (project: Project) => {
        tsvscode.postMessage({ type: 'setCurrentProject', value: project.id });
        $currentProject = project;
    }

    const createNewProject = async () => {
        if (!postProjectName) {
            error = EMPTY_STRING_ERROR;
            return;
        }

        tsvscode.postMessage({ type: 'postProject', value: { name: postProjectName } });
    }

    const fetchExistingProjects = async () => {
        tsvscode.postMessage({ type: 'getExistingProjects', value: undefined });
    }

    const setView = (existingProjects: Project[]) => {
        if (existingProjects.length > 0) {
            newProjectView = false;
        } else {
            newProjectView = true;
        }
    }

    const setViewToCreateProject = () => {
        newProjectView = true;
    }

    const setViewToJoinExistingProject = () => {
        newProjectView = false;
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "postProject":
                $currentProject = message.value;
                $page = Page.ThreadsViewer;
                break;
            case "getExistingProjects":
                existingProjects = message.value;
                setView(existingProjects);
                break;
            case "setCurrentProject":
                $page = Page.ThreadsViewer;
                break;
        }
    }

    const chooseAnotherOrganization = () => {
        $currentOrganization = null;
        $page = Page.InitializeOrganization;
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        fetchExistingProjects();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div class="pt-2">
    {#if newProjectView === true}
        <h3>{CREATE_NEW_PROJECT}:</h3>

        <form>
            <input class="my-1" placeholder="Enter project name" bind:value={postProjectName} />
            <input class="my-1" placeholder="Github repo url" value={$githubUrl} disabled/>
            <button on:click|preventDefault={createNewProject}>Submit</button>
            <div class="text-danger">{error}</div>
        </form>

        <div class="mt-2">
            <i>{INITIALIZE_MESSAGE}</i>
        </div>

        <hr/>

        {#if existingProjects.length > 0}
            <button on:click|preventDefault={setViewToJoinExistingProject}>{JOIN_EXISTING_PROJECT}</button>
        {/if}
    {/if}

    {#if newProjectView === false}
        <div class="my-2">
            <h3>{JOIN_EXISTING_PROJECT}:</h3>

            <ul>
                {#each existingProjects as project (project.id)}
                    <li>
                        <a href="0" on:click|preventDefault={() => setCurrentProject(project)}> {project.name} </a>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="mt-2">
            <i>{INITIALIZE_MESSAGE}</i>
        </div>

        <hr/>

        <button on:click|preventDefault={setViewToCreateProject}>{CREATE_NEW_PROJECT}</button>
    {/if}

    <button on:click={() => {chooseAnotherOrganization()}}>Change Organization: {$currentOrganization?.name}</button>
</div>