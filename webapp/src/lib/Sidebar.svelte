<script lang="ts">
  import type { SidebarItemType } from '../types/SidebarItemType';

  export let items: SidebarItemType[] = [];

  const logoSrc = '/doclinLogo.svg';
  const logoAlt = 'Doclin Logo';
</script>

<div class="w-64 h-screen bg-gray-800 text-white flex flex-col">
  <div class="p-4 flex items-center">
    <img src={logoSrc} alt={logoAlt} class="h-10 w-auto mr-3" />
    <span class="font-bold text-xl">Doclin</span>
  </div>
  <nav class="flex-1 p-4">
    <ul>
      {#each items as item}
        <li class="mb-2">
          <a href={item.href} class="block px-4 py-2 rounded hover:bg-gray-700">
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>
