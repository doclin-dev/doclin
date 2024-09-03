<script lang="ts">
  import TopDropdown from './TopDropdown.svelte';
  import SidebarNavigation from './SidebarNavigation.svelte';
  import type { SidebarItemType } from '../types/SidebarItemType';
  import type { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
  import { organization } from './stores/organization';
  import { user } from './stores/user';
  import { goto } from '$app/navigation';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';

  let sidebarItems: SidebarItemType[] = [];
  let organizationUrl: string;

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

  const handleItemToggle = (index: number) => {
    sidebarItems = sidebarItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isOpen: !item.isOpen,
          arrowIcon: item.isOpen ? chevronDownIcon : chevronUpIcon,
        };
      }
      return item;
    });
  };

  const handleProjectCreate = () => {
    goto(`${organizationUrl}/project/create`);
  };
</script>

<div class="w-64 h-screen bg-gray-800 text-white flex flex-col">
  <TopDropdown />
  <SidebarNavigation {sidebarItems} onItemToggle={handleItemToggle} onProjectCreate={handleProjectCreate} />
</div>
