<script lang="ts">
  import type { SidebarItemType } from '../types/SidebarItemType';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-mdi/plus';
  import { organization } from './stores/organization';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import checkIcon from '@iconify/icons-mdi/check';
  import logoutIcon from '@iconify/icons-mdi/logout';
  import { user } from './stores/user';

  let sidebarItems: SidebarItemType[] = [];
  let organizationUrl: string;
  let isProjectListOpen = true;

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
          subItems: $organization.projects.map((project) => {
            return {
              label: project.name,
              href: `${organizationUrl}/project/${project.id}`,
            };
          }),
        },
      ];
    }
  }

  let organizations = [
    { name: 'Organization 1', logo: '/doclinLogo.svg' },
    { name: 'Organization 2', logo: '/doclinLogo.svg' },
  ];
  let selectedOrganization = organizations.length > 0 ? organizations[0] : null;
  let isDropdownOpen = false;

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const closeDropdown = () => {
    isDropdownOpen = false;
  };

  const handleOrganizationChange = (org) => {
    selectedOrganization = org;
    isDropdownOpen = false;
  };

  const handleLogout = () => {
    // Add your logout logic here
  };

  const toggleProjectList = () => {
    isProjectListOpen = !isProjectListOpen;
  };
</script>

<div class="w-64 h-screen bg-gray-800 text-white flex flex-col">
  <!-- Dropdown for Organizations and User Info -->
  <div class="p-4 flex flex-col space-y-4 relative">
    <!-- User Info above Dropdown -->

    <!-- Dropdown for Organizations -->
    <div class="relative w-full">
      <button
        class="flex items-center justify-between w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
        on:click={toggleDropdown}
      >
        <div class="flex items-center">
          <img src={selectedOrganization?.logo} alt={selectedOrganization?.name} class="h-5 w-5 mr-2" />
          <span>{selectedOrganization?.name}</span>
        </div>
        <Icon icon={isDropdownOpen ? chevronUpIcon : chevronDownIcon} class="h-5 w-5" />
      </button>
      {#if isDropdownOpen}
        <ul class="absolute left-0 right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
          {#each organizations as organization}
            <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
              <div class="flex items-center">
                <img src={organization.logo} alt={organization.name} class="h-5 w-5 mr-2" />
                <button on:click={() => handleOrganizationChange(organization)} class="text-left">
                  {organization.name}
                </button>
              </div>
              {#if selectedOrganization?.name === organization.name}
                <Icon icon={checkIcon} class="h-5 w-5 text-blue-500" />
              {/if}
            </li>
          {/each}
          <!-- Divider -->
          <li class="border-t border-gray-600 my-2"></li>
          <!-- Logout Button -->
          <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">{$user?.name}</li>
          <li class="flex items-center justify-between px-4 py-2 hover:bg-gray-600">
            <button class="flex items-center w-full text-left text-red-400 hover:text-red-300 hover:bg-gray-600">
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
          {#if item.label === 'Projects'}
            <div class="flex items-center justify-between">
              <button
                class="block px-2 py-2 rounded hover:bg-gray-700 text-sm text-left w-full"
                on:click={toggleProjectList}
              >
                {item.label}
              </button>
              <a href={`${organizationUrl}/project/create`} class="text-blue-400 hover:text-blue-300">
                <Icon icon={plusIcon} class="h-5 w-5" />
              </a>
            </div>
            {#if isProjectListOpen && item.subItems}
              <ul class="ml-4">
                {#each item.subItems as project}
                  <li class="mb-2">
                    <a href={project.href} class="block px-2 py-2 rounded hover:bg-gray-700 text-sm">
                      {project.label}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          {:else}
            <a href={item.href} class="block px-2 py-2 rounded hover:bg-gray-700 text-sm">
              {item.label}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</div>
