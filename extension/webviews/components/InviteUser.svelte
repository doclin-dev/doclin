<script type="ts">
  import { Page } from '../enums';
  import type { User } from '../types';
  import Button from './Button.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { currentOrganization, currentProject, page } from '../state/store';

  let emailValue: string;
  let organizationUsers: User[];

  const submitInvite = () => {
    tsvscode.postMessage({
      type: 'inviteUser',
      value: { email: emailValue },
    });

    emailValue = '';
  };

  const switchPageToThreadsViewer = () => {
    $page = Page.ThreadsViewer;
  };

  const getCurrentOrganizationUsers = () => {
    tsvscode.postMessage({ type: 'getCurrentOrganizationUsers', value: '' });
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'getCurrentOrganizationUsers':
        organizationUsers = message.value;
        break;
    }
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);

    getCurrentOrganizationUsers();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<div>
  <div class="topbar">
    <div class="button-container">
      <Button icon="back-icon" type="text" variant='secondary' onClick={switchPageToThreadsViewer} />
    </div>
  </div>

  <h3>Invite user to {$currentOrganization?.name}/{$currentProject?.name}</h3>

  <form class="mb-2">
    <input placeholder="Enter user email" bind:value={emailValue} />
    <button on:click|preventDefault={submitInvite}>Invite user</button>
  </form>

  {#if organizationUsers}
    Users:
    <ul>
      {#each organizationUsers as user (user.id)}
        <li>{user.name}</li>
      {/each}
    </ul>
  {/if}
</div>
