<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { User } from "../types";
    import { Page } from "../enums";
    import ThreadsViewer from "./ThreadsViewer.svelte";
    import InitializeProject from "./InitializeProject.svelte";
    import ReplyViewer from "./ReplyViewer.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import InitializeOrganization from "./InitializeOrganization.svelte";
    import InviteUser from "./InviteUser.svelte";
    import AccessRequired from "./AccessRequired.svelte";

    let accessToken = "";
    let loading = true;
    let user: User | null = null;
    let error: any;
    let page: Page = WebviewStateManager.getState(WebviewStateManager.type.PAGE) ?? Page.InitializeOrganization;
    const ACCESS_REQUIRED = "accessRequired";

    const authenticate = () => {
        tsvscode.postMessage({ type: 'authenticate', value: undefined });
    }

    const logout = () => {
        accessToken = '';
        user = null;
        tsvscode.postMessage({ type: 'logout', value: undefined });
    }

    const handleGetExtensionState = (extensionState: any) => {
        error = extensionState?.error;
        user = extensionState?.user;
        const organization = extensionState?.organization;
        const project = extensionState?.project;
        const githubUrl = extensionState?.githubUrl;

        if (organization == ACCESS_REQUIRED || project == ACCESS_REQUIRED) {
            page = Page.AccessRequired;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            loading = false;
            return;
        }

        if (!githubUrl) {
            page = Page.NotGitRepo;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            loading = false;
            return;
        }

        WebviewStateManager.setState(WebviewStateManager.type.GITHUB_URL, githubUrl);

        if (!organization) {
            page = Page.InitializeOrganization;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            loading = false;
            return;
        }

        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_ORGANIZATION, organization);

        if (!project) {
            page = Page.InitializeProject;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
            loading = false;
            return;
        }

        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_PROJECT, project);

        if (page != Page.ThreadsViewer && page != Page.ReplyViewer) {
            page = Page.ThreadsViewer;
            WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
        }

        loading = false;
    }

    const getExtensionState = () => {
        tsvscode.postMessage({ type: "getExtensionState", value: undefined });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "getExtensionState":
                handleGetExtensionState(message.value);
                break;
        }
    };

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        getExtensionState();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

{#if loading}
    <div>loading...</div>
{:else if error}
    <div>Could not reach server. Please try again later!</div>
    <button on:click={getExtensionState}>Reload</button>
{:else if user}
    {#if page === Page.NotGitRepo}
        <div>Workspace folder is not a github repository.</div>
    {:else if page === Page.AccessRequired}
        <AccessRequired bind:page={page}/>
    {:else if page === Page.InitializeOrganization}
        <InitializeOrganization bind:page={page}/>
    {:else if page === Page.InitializeProject}
        <InitializeProject bind:page={page}/>
    {:else if page === Page.ThreadsViewer}
        <ThreadsViewer {user} bind:page={page} />
    {:else if page === Page.ReplyViewer}
        <ReplyViewer username={user.name} bind:page={page}/>
    {:else if page === Page.InviteUser}
        <InviteUser bind:page={page}/>
    {/if}
    
    <button on:click={logout}>Logout</button>
{:else}
    <button on:click={authenticate}>Login with GitHub</button>
{/if}
