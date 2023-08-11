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
    .card {
        display: flex;
        flex-direction: column;
    }
</style>

<div class='card'>
    <div class="thread-header">
        <div> {username}</div>
        <OverlayCard handleEdit={handleEditButtonClick} handleDelete={handleDeleteButtonClick}/>
    </div>
    <div> {@html thread.message}</div>
</div>