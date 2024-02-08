<script type="ts">
    import Button from "./Button.svelte";
    import { Page } from "../enums";
    import { page } from "../state/store";
    
    export let username: string;
    export let reload: () => void;
    export let logout: () => void;

    const switchToInvitePage = () => {
        $page = Page.InviteUser;
    }
</script>

<div class='header'>
    <div>Welcome <span class="name-header">{username}</span></div>

    <div class='icon-container'>
        <Button icon="reload" type='text' onClick={reload}/>
        <Button icon="invite" type='text' onClick={switchToInvitePage}/>
        <Button icon="logout" type='text' onClick={logout}/>
    </div>

</div>