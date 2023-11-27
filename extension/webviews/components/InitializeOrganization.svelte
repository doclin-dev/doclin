<script lang="ts">
    import type { Organization, Project } from "../types";
    import { onMount, onDestroy } from "svelte";
    import { IntializeOrganizationView, Page } from "../enums";
    import { WebviewStateManager } from "../WebviewStateManager";
    import RedeemInvitation from "./RedeemInvitation.svelte";
    import InviteUser from "./InviteUser.svelte";

    export let page: Page;
    let postOrganizationName: string = "";
    let existingOrganizations: Organization[] = [];
    let error: string = "";
    let view: IntializeOrganizationView;

    const EMPTY_STRING_ERROR: string = "Organization name cannot be empty!";
    const JOIN_ORGANIZATION: string = "Join Existing Organization";
    const ENTER_INVITATION: string = "Enter Invitation Code";
    const CREATE_NEW_ORGANIZATION: string = "Create New Organization";
    const SUBMIT: string = "Submit";

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

    const setView = (existingOrganizations: Organization[]) => {
        if (existingOrganizations.length > 0) {
            view = IntializeOrganizationView.JoinOrganization;
        } else  {
            view = IntializeOrganizationView.CreateOrganization;
        }
    }

    const setViewToCreateOrganization = () => {
        view = IntializeOrganizationView.CreateOrganization;
    }

    const setViewToJoinOrganization = () => {
        view = IntializeOrganizationView.JoinOrganization;
    }

    const setViewToEnterInvitation = () => {
        view = IntializeOrganizationView.EnterInvitation;
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
                setView(existingOrganizations);
                break;
            case "setCurrentOrganization":
                switchPageToProject();
                break;

        }
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        getExistingOrganizations();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div>
    {#if view === IntializeOrganizationView.CreateOrganization}
        <div>
            <h3>{CREATE_NEW_ORGANIZATION}:</h3>

            <form>
                <input placeholder="Enter Organization Name" bind:value={postOrganizationName} />
                <button on:click|preventDefault={createNewOrganization}>{SUBMIT}</button>
                <div class="text-danger">{error}</div>
            </form>

            <hr />

            {#if existingOrganizations.length > 0}
                <button on:click|preventDefault={setViewToJoinOrganization}>{JOIN_ORGANIZATION}</button>
            {/if}
            <button on:click|preventDefault={setViewToEnterInvitation}>{ENTER_INVITATION}</button>
        </div>
    {/if}

    {#if view === IntializeOrganizationView.EnterInvitation}
        <div>
            <h3>{ENTER_INVITATION}:</h3>
            <RedeemInvitation bind:page={page}/>

            <hr />

            <button on:click|preventDefault={setViewToCreateOrganization}>{CREATE_NEW_ORGANIZATION}</button>
            {#if existingOrganizations.length > 0}
                <button on:click|preventDefault={setViewToJoinOrganization}>{JOIN_ORGANIZATION}</button>
            {/if}
        </div>
    {/if}
    
    {#if view === IntializeOrganizationView.JoinOrganization}
        <div>
            <h3>Login into existing organization:</h3>

            <ul>
                {#each existingOrganizations as organization (organization.id)}
                    <li >
                        <a href="0" on:click|preventDefault={() => {
                            setCurrentOrganization(organization)
                        }}> {organization.name} </a>
                    </li>
                {/each}
            </ul>

            <hr />

            <button on:click|preventDefault={setViewToCreateOrganization}>{CREATE_NEW_ORGANIZATION}</button>
            <button on:click|preventDefault={setViewToEnterInvitation}>{ENTER_INVITATION}</button>
        </div>
    {/if}
</div>