<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;

    let threadMessage = tsvscode.getState()?.threadMessage || "";
    let todos: Array<{ text: string; completed: boolean; id: number }> = [];

    async function addTodo(t: string) {
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "POST",
            body: JSON.stringify({
                text: t,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const { todo } = await response.json();
        todos = [todo, ...todos];
    }

    async function populateThreadMessageField(message: string) {
        threadMessage += message;
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    function handleThreadMessageUpdate() {
        tsvscode.setState({...tsvscode.getState(), threadMessage});
        console.log(tsvscode.getState());
    }

    async function submitThreadMessage() {
        addTodo(threadMessage);
        threadMessage = "";
        tsvscode.setState({...tsvscode.getState(), threadMessage});
    }

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "populate-thread-message":
                    console.log(message.value);
                    populateThreadMessageField(message.value);
                    break;
            }
        });

        const response = await fetch(`${apiBaseUrl}/todo`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        todos = payload.todos;

        console.log(tsvscode.getState());
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
    {#each todos as todo (todo.id)}
        <li
            class:complete={todo.completed}
            on:click={async () => {
                todo.completed = !todo.completed;
                const response = await fetch(`${apiBaseUrl}/todo`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: todo.id,
                    }),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(await response.json());
            }}>
            {todo.text}
        </li>
    {/each}
</ul>
