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