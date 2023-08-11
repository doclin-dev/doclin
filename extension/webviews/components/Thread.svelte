<script>
    import OverlayCard from './OverlayCard.svelte'
    export let thread;
    export let username;

    const handleEditButtonClick = () => {
        console.log('Edit button clicked');
    }

    const handleDeleteButtonClick = () => {
        console.log('Delet Button clicked!')
    }
</script>

<style>
    .thread-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem;
    }
    .thread-card {
        display: flex;
        flex-direction: column;
        background-color: rgb(46, 48, 48);
        padding: 0.5rem;
        gap: 0.25;
        border-radius: 5px;
        border: 2px;
        margin-bottom: 0.5rem;
    }
</style>

<div class='thread-card'>
    <div class="thread-header">
        <div> {username}</div>
        <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div> {@html thread.message}</div>
</div>