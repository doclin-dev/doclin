<script type="ts">
  import Button from './Button.svelte';
  import { Page } from '../enums';
  import { currentOrganization, currentProject, currentUser, page } from '../state/store';
  import DropdownMenu from './DropdownMenu.svelte';

  export let reload: () => void;
  export let logout: () => void;
  let organizationName: string | undefined;
  let projectName: string | undefined;

  $: organizationName = $currentOrganization?.name?.split(' ').join('-').toLowerCase();
  $: projectName = $currentProject?.name.split(' ').join('-').toLowerCase();

  const switchToInvitePage = () => {
    $page = Page.InviteUser;
  };

  $: showInviteButton = $page === Page.ThreadsViewer || $page === Page.ReplyViewer;

  $: contextMenuDropdownOptions = [
    {
      key: 'logout',
      label: 'Logout',
      handler: logout,
    },
    ...(showInviteButton
      ? [
          {
            key: 'invite',
            label: 'Invite',
            handler: switchToInvitePage,
          },
        ]
      : []),
  ];

  const handleSearchButtonClick = () => {
    $page = Page.SearchViewer;
  };

  const authenticate = () => {
    tsvscode.postMessage({ type: 'authenticate', value: undefined });
  };
</script>

<div class="header">
  {#if $page !== Page.SearchViewer}
    <div><span class="name-header">{organizationName}</span>/{projectName}</div>

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
