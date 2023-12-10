<script type="ts">
    import { WebviewStateManager } from "../WebviewStateManager";
    import { Page } from "../enums";
    import type { User } from "../types";
    import Button from "./Button.svelte";
    import { onMount, onDestroy } from "svelte";

    export let page: Page;

    let emailValue: string;
    let organizationUsers: User[];
    let organizationName: string;
    let projectName: string;

    const submitInvite = () => {
        tsvscode.postMessage({
            type: "inviteUser",
            value: { email: emailValue }
        });

        emailValue = "";
    };

    const switchPageToThreadsViewer = () => {
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    };

    const getCurrentOrganizationUsers = () => {
        tsvscode.postMessage({ type: "getCurrentOrganizationUsers", value: "" });
    }

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "getCurrentOrganizationUsers":
                organizationUsers = message.value;
                break;
        }
    }

    const getOrganizationAndProjectName = () => {
        organizationName = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_ORGANIZATION)?.name;
        projectName = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT)?.name;
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);

        getOrganizationAndProjectName();
        getCurrentOrganizationUsers();
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });
</script>

<div>
    <div class='topbar'>
        <div class="button-container">
            <Button icon='back-icon' type='text' onClick={switchPageToThreadsViewer}/>
        </div>
    </div>
    
    <h3>Invite user to {organizationName}/{projectName}</h3>

    <form class="mb-2">
        <input placeholder="Enter user email" bind:value={emailValue} />
        <button on:click|preventDefault={submitInvite}>Invite user</button>
    </form>
    
    {#if organizationUsers}
        Users:
        <ul>
            {#each organizationUsers as user (user.id)}
                <li>{user.name}</li>
            {/each}
        </ul>
    {/if}
</div>