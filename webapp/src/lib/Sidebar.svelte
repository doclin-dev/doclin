<script lang="ts">
  import type { SidebarItemType } from '../types/SidebarItemType';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import checkIcon from '@iconify/icons-mdi/check';
  import logoutIcon from '@iconify/icons-mdi/logout';
  import { organization } from './stores/organization';
  import { user } from './stores/user';
  import { onMount } from 'svelte';
  import type { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
  import { goto } from '$app/navigation';

  let sidebarItems: SidebarItemType[] = [];
  let organizationUrl: string;
  let isDropdownOpen = false;

  $: {
    if ($organization) {
      organizationUrl = `/organization/${$organization.id}`;

      sidebarItems = [
        {
          label: 'Home',
          href: organizationUrl,
        },
        {
          label: 'Projects',
          href: '#',
          isOpen: true,
          subItems: $organization.projects.map((project) => ({
            label: project.name,
            href: `${organizationUrl}/project/${project.id}`,
          })),
        },
      ];
    }
  }

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const closeDropdown = () => {
    isDropdownOpen = false;
  };

  const handleOrganizationChange = (org: OrganizationDTO) => {
    isDropdownOpen = false;
    goto(`/organization/${org.id}`);
  };

  const handleLogout = () => {
    // Add your logout logic here
  };

  console.log($user);

  const toggleItem = (index: number) => {
    sidebarItems = sidebarItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isOpen: !item.isOpen,
          arrowIcon: item.isOpen ? chevronDownIcon : chevronUpIcon, // Toggle arrow icon
        };
      }
      return item;
    });
  };

  // Close the dropdown when clicking outside
  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (target && !target.closest('.relative')) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="w-64 h-screen bg-gray-800 text-white flex flex-col">
  <!-- Dropdown for Organizations -->
  <div class="p-4 flex flex-col space-y-4 relative">
    <div class="relative w-full">
      <button
        class="flex items-center justify-between w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
        on:click={toggleDropdown}
      >
        <div class="flex items-center">
          <img src="/doclinLogo.svg" alt={$organization?.name} class="h-5 w-5 mr-2" />
          <span>{$organization?.name}</span>
        </div>
        <Icon icon={isDropdownOpen ? chevronUpIcon : chevronDownIcon} class="h-5 w-5" />
      </button>
      {#if isDropdownOpen}
        <ul class="absolute left-0 right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
          {#each $user.organizations as org}
            <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
              <div class="flex items-center">
                <button on:click={() => handleOrganizationChange(org)} class="text-left">
                  {org.name}
                </button>
              </div>
              {#if $organization?.id === org.id}
                <Icon icon={checkIcon} class="h-5 w-5 text-blue-500" />
              {/if}
            </li>
          {/each}
          <li class="border-t border-gray-600 my-2"></li>
          <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
            <button
              on:click={handleLogout}
              class="flex items-center w-full text-left text-red-400 hover:text-red-300 hover:bg-gray-600"
            >
              <Icon icon={logoutIcon} class="h-5 w-5" />
              <span class="ml-2">Logout</span>
            </button>
          </li>
        </ul>
      {/if}
    </div>
  </div>

  <!-- Sidebar Navigation -->
  <nav class="flex-1 p-4">
    <ul>
      {#each sidebarItems as item, i}
        <li class="mb-2">
          {#if item.subItems}
            <div class="flex items-center">
              <button
                class="flex items-center w-full py-2 rounded hover:bg-gray-700 text-sm text-left"
                on:click={() => toggleItem(i)}
              >
                <Icon icon={item.arrowIcon || chevronDownIcon} class="h-5 w-5" />
                {item.label}

                {#if item.label === 'Projects'}
                  <a href={`${organizationUrl}/project/create`} class="text-blue-400 hover:text-blue-300">
                    <Icon icon={plusIcon} class="h-5 w-5" />
                  </a>
                {/if}
              </button>
            </div>
            {#if item.isOpen}
              <ul>
                {#each item.subItems as subItem}
                  <li>
                    <a href={subItem.href} class="sub-item text-sm">
                      {subItem.label}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          {:else}
            <a href={item.href} class="sidebar-item text-sm">
              {item.label}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .sidebar-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .sidebar-item:hover {
    background-color: #4a5568; /* Adjust this to the hover color you prefer */
  }

  .sub-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .sub-item:hover {
    background-color: #2d3748; /* Adjust this to the hover color you prefer */
  }
</style>
