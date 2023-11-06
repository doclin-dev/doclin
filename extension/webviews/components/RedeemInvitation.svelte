<script type="ts">
    import { onMount, onDestroy } from "svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import { Page } from "../enums";

    export let page: Page;
    let invitationCodeValue: string = "";
    const INVITATION_EXPIRED: string = "invitationExpired";

    const submitInvitationCode = async () => {
        tsvscode.postMessage({ type: 'redeemInvitation', value: { invitationCode: invitationCodeValue } });
    }

    const switchPageToThreadsViewer = () => {
        page = Page.ThreadsViewer;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    onMount(async () => {
        window.addEventListener("message", messageEventListener);
    });

    onDestroy(() => {
        window.removeEventListener("message", messageEventListener);
    });

    const messageEventListener = async (event: any) => {
        const message = event.data;
        switch (message.type) {
            case "redeemInvitation":
                if (message.value != INVITATION_EXPIRED) {
                    switchPageToThreadsViewer();
                }
        }
    }
</script>

<form>
    <input placeholder="Enter Invitation Code" bind:value={invitationCodeValue} />
    <button on:click|preventDefault={submitInvitationCode}>Enter Invitation Code</button>
</form>