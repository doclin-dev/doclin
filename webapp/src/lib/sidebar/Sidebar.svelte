<script lang="ts">
  import TopDropdown from './TopDropdown.svelte';
  import SidebarNavigation from './SidebarNavigation.svelte';
  import type { SidebarItemType } from '../../types/SidebarItemType';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
  import chevronDownIcon from '@iconify/icons-mdi/chevron-down';
  import chevronUpIcon from '@iconify/icons-mdi/chevron-up';
  import plusIcon from '@iconify/icons-mdi/plus';
  import { organization } from '$lib/stores/organization';

  let organizationUrl: string;
  let sidebarItems: SidebarItemType[];

  const getProjects = (organization: OrganizationDTO) => {
    return organization.projects.map((project) => ({
      label: project.name,
      href: `${organizationUrl}/project/${project.id}`,
      private: project.privateProject,
    }));
  };

  $: {
    if ($organization) {
      organizationUrl = `/organization/${$organization.id}`;

      sidebarItems = [
        {
          label: 'Projects',
          href: `#`,
          actions: [
            {
              href: `${organizationUrl}/project/create`,
              icon: plusIcon,
            },
          ],
          isOpen: true,
          subItems: getProjects($organization),
        },
      ];
    }
  }

  const toggleCollpase = (index: number) => {
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
</script>

<div class="fixed w-64 h-screen bg-gray-900 text-white flex flex-col">
  <TopDropdown />
  <SidebarNavigation {sidebarItems} {toggleCollpase} />
</div>
