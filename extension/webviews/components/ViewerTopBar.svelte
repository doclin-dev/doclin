<script>
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    
    export let username;
    let currentProject;

    onMount(() => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
    });
</script>

<div class="project-info">Project: {currentProject?.name}</div>
<div class='header'>
    <div>Welcome <span style="font-weight:500; font-size:14px" >{username}</span></div>
    <div class='icon-container'>
        <Button icon="refresh" type="text"/>
        <Button icon="notification" type='text'/>
        <Button icon="open-in-new-window" type='text'/>
    </div>
</div>

<style>
    .project-info {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: large;
        font-weight: 400;
        justify-content: center;
    }
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        margin-right: 0.75rem;
    }
    .icon-container {
        display: flex;
        width: 10%;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        gap: 0.25rem;
    }
</style>