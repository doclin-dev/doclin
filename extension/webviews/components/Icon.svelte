<script>
    import Icon from '@iconify/svelte';
    import replyOutline from '@iconify/icons-mdi/reply-outline';
    import reloadIcon from '@iconify/icons-mdi/reload';
    import dotsHorizontal from '@iconify/icons-mdi/dots-horizontal';
    import keyboardBackspace from '@iconify/icons-mdi/keyboard-backspace';
    import bellOutline from '@iconify/icons-mdi/bell-outline';
    import openInNew from '@iconify/icons-mdi/open-in-new';

    export let name;
    export let width = 20;
    export let height = 20;
    let icon;

    switch(name) {
        case "reply":
            icon = replyOutline;
            break;
        case "refresh":
            icon = reloadIcon;
            break;
        case "context-menu":
            icon = dotsHorizontal;
            break;
        case "back-icon":
            icon = keyboardBackspace;
            break;
        case "notification":
            icon = bellOutline;
            break;
        case "open-in-new-window":
            icon = openInNew;
            break;
    }
</script>

<div class="icon">
    <Icon icon={icon} width={width} height={height} />
</div>

<style>
    .icon {
        padding: 0;
        align-items: center;
    }
</style>