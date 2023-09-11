<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { User } from "../types";
    import { Page } from "../enums";
    import ThreadsViewer from "./ThreadsViewer.svelte";
    import InitializeProject from "./InitializeProject.svelte";
    import ReplyViewer from "./ReplyViewer.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";

    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let page: Page = WebviewStateManager.getState(WebviewStateManager.type.PAGE) ?? Page.InitializeProject;

    const authenticate = () => {
        tsvscode.postMessage({ type: 'authenticate', value: undefined });
    }

    const logout = () => {
        accessToken = '';
        user = null;
        tsvscode.postMessage({ type: 'logout', value: undefined });
    }

    const messageEventListener = async (event: any) => {
            const message = event.data;
            switch (message.type) {
                case "getAuthenticatedUser":
                    user = message.value;
                    loading = false;
                    break;
            }
        };


    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        tsvscode.postMessage({ type: "getAuthenticatedUser", value: undefined });
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

{#if loading}
    <div>loading...</div>
{:else if user}
    {#if page === Page.InitializeProject}
        <InitializeProject bind:page={page}/>
    {:else if page === Page.ThreadsViewer}
        <ThreadsViewer {user} bind:page={page} />
    {:else if page === Page.ReplyViewer}
        <ReplyViewer username={user.name} bind:page={page}/>
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
        }}>Feedback</button>
    <button
        on:click={logout}>Logout</button>
{:else}
    <button
        on:click={authenticate}>Login with GitHub</button>
{/if}
