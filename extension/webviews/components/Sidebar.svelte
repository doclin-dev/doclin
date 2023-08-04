<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";
    import Threads from "./Threads.svelte";
    import InitializeProject from "./InitializeProject.svelte";

    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let page: "initializeProject" | "threads" | "contact" = tsvscode.getState()?.page;

    $: {
        tsvscode.setState({ ...tsvscode.getState(), page });
    }

    onMount(async () => {
        page = "initializeProject";
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

        const currentProject = await fetch(`${apiBaseUrl}/currentProject`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });

        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

{#if loading}
    <div>loading...</div>
{:else if user}
    {#if page === 'initializeProject'}
        <InitializeProject {user} {accessToken}/>
    {:else if page === 'threads'}
        <Threads {user} {accessToken} />
        <button
            on:click={() => {
                page = 'contact';
            }}>go to contact</button>
    {:else if page === 'contact'}
        <div>Contact me here:</div>
        <button
            on:click={() => {
                page = 'threads';
            }}>go back</button>
    {/if}
    <button
        on:click={() => {
            accessToken = '';
            user = null;
            tsvscode.postMessage({ type: 'logout', value: undefined });
        }}>logout</button>
{:else}
    <button
        on:click={() => {
            tsvscode.postMessage({ type: 'authenticate', value: undefined });
        }}>login with GitHub</button>
{/if}
