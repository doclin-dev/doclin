<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { User } from "../types";
    import { ActiveView, Page, SidebarLoadingStatus } from "../enums";
    import ThreadsViewer from "./thread/ThreadsViewer.svelte";
    import InitializeProject from "./InitializeProject.svelte";
    import ReplyViewer from "./reply/ReplyViewer.svelte";
    import InitializeOrganization from "./InitializeOrganization.svelte";
    import InviteUser from "./InviteUser.svelte";
    import AccessRequired from "./AccessRequired.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import RegisterEmail from "./RegisterEmail.svelte";
    import { activeView, currentOrganization, currentProject, page, reload, threadSelected } from "../state/store";

    let loading = true;
    let user: User | null = null;
    let error: any;

    const authenticate = () => {
        tsvscode.postMessage({ type: 'authenticate', value: undefined });
    }

    const logout = () => {
        user = null;
        tsvscode.postMessage({ type: 'logout', value: undefined });
    }

    const handleGetExtensionState = (extensionState: any) => {
        $reload += 1;
        error = extensionState?.error;
        user = extensionState?.user;
        $currentOrganization = extensionState?.organization;
        $currentProject = extensionState?.project;
        const isFolderOrFileOpened = extensionState?.isFolderOrFileOpened;

        if (!user?.email) {
            $page = Page.RegisterEmail;
            loading = false;
            return;
        }

        if (!isFolderOrFileOpened) {
            $page = Page.NoFolderOrFile;
            loading = false;
            return;
        }

        if ($currentOrganization && $currentOrganization?.unauthorized) {
            $page = Page.AccessRequired;
            loading = false;
            return;
        }

        if (!$currentOrganization) {
            $page = Page.InitializeOrganization;
            loading = false;
            return;
        }

        if (!$currentProject) {
            $page = Page.InitializeProject;
            loading = false;
            return;
        }

        if ($page != Page.ThreadsViewer && $page != Page.ReplyViewer) {
            $page = Page.ThreadsViewer;
        }

        loading = false;
    }

    const getExtensionState = () => {
        tsvscode.postMessage({ type: "getExtensionState", value: null });
    }

    const reloadAndGetExtensionState = () => {
        tsvscode.postMessage({ type: "reloadAndGetExtensionState", value: null });
    }

    const getSidebarLoadingStatus = () => {
        let response = SidebarLoadingStatus.LOADING;

        if (!loading) {
            response = SidebarLoadingStatus.LOADING_COMPLETE
        }

        tsvscode.postMessage({
            type: "getSidebarLoadingStatus",
            value: response
        });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "getExtensionState":
                handleGetExtensionState(message.value);
                break;
            case "reloadAndGetExtensionState":
                handleGetExtensionState(message.value);
                break;
            case "getSidebarLoadingStatus":
                getSidebarLoadingStatus();
                break;
            case "viewFileThreads":
                $page = Page.ThreadsViewer;
                $activeView = ActiveView.CurrentFileThreads;
                break;
            case "viewThread":
                $threadSelected = message.value;
                $page = Page.ReplyViewer;
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
    <button on:click={reloadAndGetExtensionState}>Reload</button>
{:else if user}
    <ViewerTopBar username={user?.name} reload={reloadAndGetExtensionState} logout={logout}/>

    {#if $page === Page.RegisterEmail}
        <RegisterEmail/>
    {:else if $page === Page.NoFolderOrFile}
        <div>Open a file or a folder to use doclin features.</div>
    {:else if $page === Page.AccessRequired}
        <AccessRequired/>
    {:else if $page === Page.InitializeOrganization}
        <InitializeOrganization/>
    {:else if $page === Page.InitializeProject}
        <InitializeProject/>
    {:else if $page === Page.ThreadsViewer}
        <ThreadsViewer />
    {:else if $page === Page.ReplyViewer}
        <ReplyViewer/>
    {:else if $page === Page.InviteUser}
        <InviteUser/>
    {/if}
{:else}
    <button on:click={authenticate}>Login with GitHub</button>
{/if}
