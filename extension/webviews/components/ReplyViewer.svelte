<script>
    import OverlayCard from "./OverlayCard.svelte";
    import ViewerTopBar from "./ViewerTopBar.svelte";
    import Button from "./Button.svelte";
    import { editedThreadId, selectedThread } from './store.js';
    import Thread from "./Thread.svelte";

    export let thread;
    export let projectName;
    export let username;

    let quillThreadEditor;

    const handleDeleteButtonClick = () => {
        console.log('Delete button clicked!');
    }

    const handleBackClick = () => {
        selectedThread.set(null);
    }

</script>

<style>
    .topbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<div class='reply-viewer'>
    <div class='topbar'>
        <Button icon='back-icon' type='text' onClick={handleBackClick}/>
        <OverlayCard isEditable={false} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div>
        <Thread thread={thread}/>
    </div>
</div>