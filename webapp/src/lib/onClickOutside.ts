import { onMount } from 'svelte';

export function onClickOutside(node: HTMLElement, callback: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node)) {
      callback();
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClick, true);
  });

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}
