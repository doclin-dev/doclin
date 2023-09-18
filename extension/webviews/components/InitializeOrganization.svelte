<script lang="ts">
    import type { Project } from "../types";
    import { onMount, onDestroy } from "svelte";
    import { Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";

    export let page: Page;

    let postOrganizationName: string = "";
    let existingCompanies: Project[] = [];
    let invitationCode: string = "";

    const setCurrentOrganization = (currentOrganization: Project) => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_ORGANIZATION, currentOrganization);
        page = Page.InitializeProject;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const createNewOrganization = async () => {
        tsvscode.postMessage({ type: 'postOrganization', value: { name: postOrganizationName } });
    }

    const getExistingCompanies = async () => {
        tsvscode.postMessage({ type: 'getExistingCompanies', value: undefined });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "postOrganization":
                setCurrentOrganization(message.value);
                break;
            case "getExistingCompanies":
                existingCompanies = message.value;
                break;
        }
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        getExistingCompanies();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div>
    {#if existingCompanies.length > 0}
        <p>Login into Existing Organization:</p>

        <ul>
            {#each existingCompanies as organization (organization.id)}
                <li >
                    <a href="0" on:click|preventDefault={() => {
                        setCurrentOrganization(organization)
                    }}> {organization.name} </a>
                </li>
            {/each}
        </ul>
    {:else}
        <p>You have not joined any organization.</p>
    {/if}

    <h3>Create New Organization:</h3>

    <form>
        <input placeholder="Enter Organization Name" bind:value={postOrganizationName} />
        <button on:click|preventDefault={createNewOrganization}>Create Organization</button>
    </form>
</div>