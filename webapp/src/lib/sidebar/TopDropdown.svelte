<script lang="ts">
  import type { OrganizationDTO } from '../../../../shared/types/OrganizationDTO';
  import Icon from '@iconify/svelte';
  import checkIcon from '@iconify/icons-mdi/check';
  import logoutIcon from '@iconify/icons-mdi/logout';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { organization } from '../stores/organization';
  import { user } from '../stores/user';
  import plusIcon from '@iconify/icons-mdi/plus';

  let isDropdownOpen = false;

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const closeDropdown = () => {
    isDropdownOpen = false;
  };

  const handleOrganizationChange = (org: OrganizationDTO) => {
    goto(`/organization/${org.id}`);
    closeDropdown();
  };

  const handleLogout = () => {
    // Add your logout logic here
  };

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('.dropdown-container')) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="p-4 flex flex-col space-y-4 relative dropdown-container text-sm">
  <div class="relative w-full">
    <button
      class="flex items-center justify-between w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
      on:click={toggleDropdown}
    >
      <div class="flex items-center">
        <img src="/doclinLogo.svg" alt={$organization.name} class="h-5 w-5 mr-2" />
        <span>{$organization.name}</span>
      </div>
      <Icon icon={isDropdownOpen ? chevronUpIcon : chevronDownIcon} class="h-5 w-5" />
    </button>
    {#if isDropdownOpen}
      <ul class="absolute left-0 right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
        <li class="text-xs px-4 pt-2 font-bold">Organizations:</li>
        {#each $user.organizations as org}
          <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
            <button on:click={() => handleOrganizationChange(org)} class="text-left w-full">
              {org.name}
            </button>
            {#if $organization.id === org.id}
              <Icon icon={checkIcon} class="h-5 w-5 text-blue-500" />
            {/if}
          </li>
        {/each}
        <li class="border-t border-gray-600"></li>
        <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
          <button on:click={() => goto('/organization/create')} class="flex items-center w-full text-left">
            <span class="">Create Organization</span>
            <Icon icon={plusIcon} class="h-5 w-5 ml-2" />
          </button>
        </li>
        <li class="border-t border-gray-600"></li>
        <li class="text-xs px-4 pt-2 font-bold">{$user.name}</li>
        <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
          <button
            on:click={handleLogout}
            class="flex items-center w-full text-left text-red-400 hover:text-red-300 hover:bg-gray-600"
          >
            <span class="">Logout</span>
          </button>
        </li>
      </ul>
    {/if}
  </div>
</div>

<style>
  .dropdown-container {
    position: relative;
  }
</style>
