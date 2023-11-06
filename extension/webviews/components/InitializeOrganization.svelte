<script lang="ts">
    import type { Organization, Project } from "../types";
    import { onMount, onDestroy } from "svelte";
    import { Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";
    import RedeemInvitation from "./RedeemInvitation.svelte";

    export let page: Page;
    let postOrganizationName: string = "";
    let existingOrganizations: Organization[] = [];
    let error: string = "";
    const EMPTY_STRING_ERROR: string = "Organization name cannot be empty!";

    const switchPageToProject = () => {
        page = Page.InitializeProject;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    const addCurrentOrganizationToState = (organization: Organization) => {
        WebviewStateManager.setState(WebviewStateManager.type.CURRENT_ORGANIZATION, organization);
    }

    const setCurrentOrganization = (organization: Organization) => {
        tsvscode.postMessage({ type: 'setCurrentOrganization', value: organization?.id });
        addCurrentOrganizationToState(organization);
    }

    const createNewOrganization = async () => {
        if (!postOrganizationName) {
            error = EMPTY_STRING_ERROR;
            return;
        }

        tsvscode.postMessage({ type: 'postOrganization', value: { name: postOrganizationName } });
    }

    const getExistingOrganizations = async () => {
        tsvscode.postMessage({ type: 'getExistingOrganizations', value: undefined });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "postOrganization":
                addCurrentOrganizationToState(message.value);
                switchPageToProject();
                break;
            case "getExistingOrganizations":
                existingOrganizations = message.value;
                break;
            case "setCurrentOrganization":
                switchPageToProject();
                break;

        }
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        getExistingOrganizations();
        tsvscode.postMessage({ type: 'getGithubUrl', value: undefined });
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div>
    <div class="invitation-margin-bt">
        <h3>Create new organization:</h3>

        <form>
            <input placeholder="Enter Organization Name" bind:value={postOrganizationName} />
            <button on:click|preventDefault={createNewOrganization}>Create New Organization</button>
            <div class="text-danger">{error}</div>
        </form>
    </div>

    <hr/>

    <div class="invitation-margin-hr">
        <h3>Or, enter invitation code:</h3>
        <RedeemInvitation bind:page={page}/>
    </div>

    <hr />
    
    {#if existingOrganizations.length > 0}
        <div class="invitation-margin-hr">
            <h3>Or, login into existing organization:</h3>

            <ul>
                {#each existingOrganizations as organization (organization.id)}
                    <li >
                        <a href="0" on:click|preventDefault={() => {
                            setCurrentOrganization(organization)
                        }}> {organization.name} </a>
                    </li>
                {/each}
            </ul>
        </div>
    {:else}
        <p>You have not joined any organization.</p>
    {/if}
</div>