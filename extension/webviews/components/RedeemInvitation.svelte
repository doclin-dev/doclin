<script type="ts">
    import { onMount, onDestroy } from "svelte";
    import { Page } from "../enums";
    import { page } from "./store";

    let invitationCodeValue: string = "";
    const INVITATION_EXPIRED: string = "invitationExpired";

    const submitInvitationCode = async () => {
        tsvscode.postMessage({ type: 'redeemInvitation', value: { invitationCode: invitationCodeValue } });
    }

    const switchPageToThreadsViewer = () => {
        $page = Page.ThreadsViewer;
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
    <button on:click|preventDefault={submitInvitationCode}>Submit</button>
</form>