<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;

    let threadMessage = tsvscode.getState()?.threadMessage || "";
    let threads: Array<{ message: string; id: number }> = [];

    async function postThreadMessage(t: string) {
    const response = await fetch(`${apiBaseUrl}/threads`, {
            method: "POST",
            body: JSON.stringify({
                message: t,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const { thread } = await response.json();
        threads = [thread, ...threads];
    }

    async function populateThreadMessageField(message: string) {
        threadMessage += message;
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    function handleThreadMessageUpdate() {
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    async function submitThreadMessage() {
        postThreadMessage(threadMessage);
        threadMessage = "";
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populate-thread-message":
                    populateThreadMessageField(message.value);
                    break;
            }
        });

        const response = await fetch(`${apiBaseUrl}/threads`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        threads = payload.threads;
    });
</script>

<style>
    .complete {
        text-decoration: line-through;
    }
</style>

<div>Hello: {user.name}</div>

<form
    on:submit|preventDefault={submitThreadMessage}>
    <textarea bind:value={threadMessage} on:input={handleThreadMessageUpdate}></textarea>
    <button on:click|preventDefault={submitThreadMessage}>Submit</button>
</form>

<ul>
    {#each threads as thread (thread.id)}
        <li>
            {thread.message}
        </li>
    {/each}
</ul>
