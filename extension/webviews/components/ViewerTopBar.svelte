<script type="ts">
  import Button from './Button.svelte';
  import { Page } from '../enums';
  import { currentProject, page } from '../state/store';
  import DropdownMenu from './DropdownMenu.svelte';

  export let username: string;
  export let reload: () => void;
  export let logout: () => void;

  const switchToInvitePage = () => {
    $page = Page.InviteUser;
  };


  const showInviteButton = $page === Page.ThreadsViewer || $page === Page.ReplyViewer;

  const dropdownOptions = [
    {
      key: 'logout',
      label: 'Logout',
      handler: logout,
    },
    ...(showInviteButton ? [{
      key: 'invite',
      label: 'Invite',
      handler: switchToInvitePage,
    }] : []),
  ];

  const handleSearchButtonClick = () => {
    $page = Page.SearchViewer;
  };
</script>

<div class="header">
  {#if $page !== Page.SearchViewer}
    <div>Welcome <span class="name-header">{username}</span></div>

    <div class="icon-container">
      {#if $currentProject}
        <Button icon='search' type="text" onClick={handleSearchButtonClick}/>
      {/if}
      
      <Button icon="reload" type="text" onClick={reload} />

      <DropdownMenu options={dropdownOptions} />
    </div>
  {/if}
</div>