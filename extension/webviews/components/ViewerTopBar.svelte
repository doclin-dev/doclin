<script type="ts">
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    import { WebviewStateManager } from "../WebviewStateManager";
    import { Page } from "../enums";
    import type { Project } from "../types";
    
    export let username: string;
    export let page: Page;
    export let reload: () => void;
    export let logout: () => void;
    
    let currentProject: Project | null; 

    const switchToInvitePage = () => {
        page = Page.InviteUser;
        WebviewStateManager.setState(WebviewStateManager.type.PAGE, page);
    }

    onMount(() => {
        currentProject = WebviewStateManager.getState(WebviewStateManager.type.CURRENT_PROJECT);
    });
</script>

<div class='header'>
    <div>Welcome <span class="name-header">{username}</span></div>

    <div class='icon-container'>
        <Button icon="reload" type='text' onClick={reload}/>
        <Button icon="invite" type='text' onClick={switchToInvitePage}/>
        <Button icon="logout" type='text' onClick={logout}/>
    </div>

</div>