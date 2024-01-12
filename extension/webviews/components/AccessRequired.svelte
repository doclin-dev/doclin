<script lang="ts">
    import RedeemInvitation from "./RedeemInvitation.svelte";
    import type { Page } from "../enums";

    export let page: Page;
</script>

<div>
    <div>Contact admin for access to this project.</div>

    <RedeemInvitation bind:page={page} />
</div>
