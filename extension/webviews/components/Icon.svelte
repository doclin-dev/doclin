<script>
    import {doclinIcons} from './Icons';
    export let name;
    export let width = 20;
    export let height = 20;

    const Icons = doclinIcons;
    const svgContent = Icons[name]?.src;

</script>

<div class="icon">
    <svg
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
    {@html svgContent}
      
    </svg>
</div>

<style>
    .icon {
        padding: 0;
        align-items: center;
    }
</style>