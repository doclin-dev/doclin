<script type="ts">
  import Button from './Button.svelte';
  import { Page } from '../enums';
  import { page } from '../state/store';
  import DropdownMenu from './DropdownMenu.svelte';
  import SearchViewer from './SearchViewer.svelte';

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
    console.log('search button clicked');
  };
</script>

<div class="header">
  <div>Welcome <span class="name-header">{username}</span></div>

  <div class="icon-container">
    <SearchViewer/>
    
    <Button icon="reload" type="text" onClick={reload} />

    <DropdownMenu options={dropdownOptions} />

    <!-- {#if $page === Page.ThreadsViewer || $page === Page.ReplyViewer}
      <Button icon="invite" type="text" onClick={switchToInvitePage} />
    {/if} -->

    <!-- <Button icon="logout" type="text" onClick={logout} /> -->
  </div>
</div>