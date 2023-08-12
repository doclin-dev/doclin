<script lang="ts">
    import { onMount } from "svelte";
    import type { Project, User } from "../types";
    import { Page } from "../enums";
    import ThreadsViewer from "./ThreadsViewer.svelte";
    import InitializeProject from "./InitializeProject.svelte";

    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let page: Page = tsvscode.getState()?.page;
    
    $: {
        tsvscode.setState({ ...tsvscode.getState(), page });
    }

    const authenticate = () => {
        tsvscode.postMessage({ type: 'authenticate', value: undefined });
    }

    const logout = () => {
        accessToken = '';
        user = null;
        tsvscode.postMessage({ type: 'logout', value: undefined });
    }

    onMount(async () => {
        page = Page.InitializeProject;

        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "token":
                    accessToken = message.value;
                    const response = await fetch(`${apiBaseUrl}/me`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json();
                    user = data.user;
                    loading = false;
            }
        });

        tsvscode.postMessage({ type: "get-token", value: undefined });

        const currentProject: Project = tsvscode.getState()?.currentProject;
        if (currentProject) {
            page = Page.ThreadsViewer;
        }
    });
</script>

{#if loading}
    <div>loading...</div>
{:else if user}
    {#if page === Page.InitializeProject}
        <InitializeProject {accessToken} bind:page={page}/>
    {:else if page === Page.ThreadsViewer}
        <ThreadsViewer {user} {accessToken} />
        <button
            on:click={() => {
                page = Page.InitializeProject;
            }}>Choose another project</button>
    {:else if page === Page.Contact}
        <div>Contact me here:</div>
        <button
            on:click={() => {
                page = Page.ThreadsViewer;
            }}>go back</button>
    {/if}
    <button
        on:click={() => {
            page = Page.Contact;
        }}>go to contact</button>
    <button
        on:click={logout}>logout</button>
{:else}
    <button
        on:click={authenticate}>login with GitHub</button>
{/if}
