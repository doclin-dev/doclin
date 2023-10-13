<script type="ts">
    import { WebviewStateManager } from "../WebviewStateManager";
    import { Page } from "../enums";
    import Button from "./Button.svelte";

    export let page: Page;

    let emailValue: string;

    const submitInvite = () => {
        
    };

    const switchPageToThreadsViewer = () => {
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    };
</script>

<div>
    <div class='topbar'>
        <div class="button-container">
            <Button icon='back-icon' type='text' onClick={switchPageToThreadsViewer}/>
        </div>
    </div>
    
    <h3>Invite user to organizationName/project</h3>

    <form>
        <input placeholder="Enter user email" bind:value={emailValue} />
        <button on:click|preventDefault={submitInvite}>Invite user</button>
    </form>

    Members:
</div>