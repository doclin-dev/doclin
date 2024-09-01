<script type="ts">
  import Button from './Button.svelte';
  import { Page } from '../enums';
  import { currentOrganization, currentProject, currentUser, page } from '../state/store';
  import DropdownMenu from './DropdownMenu.svelte';
  import type { DropdownMenuOption, User } from '../types';

  export let reload: () => void;
  export let logout: () => void;
  let organizationName: string | undefined;
  let projectName: string | undefined;
  let contextMenuDropdownOptions: DropdownMenuOption[];

  $: organizationName = $currentOrganization?.name ? $currentOrganization?.name.split(' ').join('-').toLowerCase() : '';
  $: projectName = $currentProject?.name ? $currentProject?.name.split(' ').join('-').toLowerCase() : '';
  $: contextMenuDropdownOptions = getContextMenuOptions($currentUser, $page);

  const switchToInvitePage = () => {
    $page = Page.InviteUser;
  };

  const getContextMenuOptions = (currentUser: User | null, page: Page) => {
    const options: DropdownMenuOption[] = [];

    if (currentUser) {
      options.push({
        key: 'logout',
        label: 'Logout',
        handler: logout,
      });
    }

    if (page === Page.ThreadsViewer || page === Page.ReplyViewer) {
      options.push({
        key: 'invite',
        label: 'Invite',
        handler: switchToInvitePage,
      });
    }

    return options;
  };

  const handleSearchButtonClick = () => {
    $page = Page.SearchViewer;
  };

  const authenticate = () => {
    tsvscode.postMessage({ type: 'authenticate', value: undefined });
  };
</script>

<div class="header">
  {#if $page !== Page.SearchViewer}
    <div>
      {#if organizationName || projectName}
        <span class="name-header">{organizationName}</span>/{projectName}
      {/if}
    </div>

    <div class="icon-container">
      {#if !$currentUser}
        <Button type="text" title="Login" variant="primary" size="md" onClick={authenticate} />
      {/if}

      {#if $currentProject}
        <Button icon="search" type="text" variant="secondary" onClick={handleSearchButtonClick} />
      {/if}

      <Button icon="reload" type="text" variant="secondary" onClick={reload} />

      <DropdownMenu options={contextMenuDropdownOptions} />
    </div>
  {/if}
</div>
