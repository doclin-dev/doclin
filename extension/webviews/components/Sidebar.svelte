<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ExtensionState, User } from '../types';
  import { ActiveView, Page, SidebarLoadingStatus } from '../enums';
  import ThreadsViewer from './thread/ThreadsViewer.svelte';
  import InitializeProject from './InitializeProject.svelte';
  import ReplyViewer from './reply/ReplyViewer.svelte';
  import InitializeOrganization from './InitializeOrganization.svelte';
  import InviteUser from './InviteUser.svelte';
  import AccessRequired from './AccessRequired.svelte';
  import ViewerTopBar from './ViewerTopBar.svelte';
  import RegisterEmail from './RegisterEmail.svelte';
  import SearchViewer from './SearchViewer.svelte';
  import {
    activeView,
    currentOrganization,
    currentProject,
    currentUser,
    page,
    reload,
    threadSelected,
  } from '../state/store';

  let loading = true;
  let error: any;

  const authenticate = () => {
    tsvscode.postMessage({ type: 'authenticate', value: undefined });
  };

  const logout = () => {
    $currentUser = null;
    tsvscode.postMessage({ type: 'logout', value: undefined });
  };

  const handleGetExtensionState = (extensionState: ExtensionState) => {
    $reload += 1;
    error = extensionState?.error;
    $currentUser = extensionState?.user;
    $currentOrganization = extensionState?.organization;
    $currentProject = extensionState?.project;
    const isFolderOrFileOpened = extensionState?.isFolderOrFileOpened;

    if ($currentUser && !$currentUser?.email) {
      $page = Page.RegisterEmail;
      loading = false;
      return;
    }

    if (!isFolderOrFileOpened) {
      $page = Page.NoFolderOrFile;
      loading = false;
      return;
    }

    if (!$currentUser && !$currentOrganization) {
      $page = Page.Login;
      loading = false;
      return;
    }

    if (!$currentUser && ($currentOrganization?.unauthorized || $currentProject?.unauthorized)) {
      $page = Page.Login;
      loading = false;
      return;
    }

    if ($currentUser && $currentProject && $currentProject?.unauthorized) {
      $page = Page.AccessRequired;
      loading = false;
      return;
    }

    if (!$currentOrganization) {
      $page = Page.InitializeOrganization;
      loading = false;
      return;
    }

    if (!$currentProject) {
      $page = Page.InitializeProject;
      loading = false;
      return;
    }

    if ($page != Page.ThreadsViewer && $page != Page.ReplyViewer) {
      $page = Page.ThreadsViewer;
    }

    loading = false;
  };

  const getExtensionState = () => {
    tsvscode.postMessage({ type: 'getExtensionState', value: null });
  };

  const reloadAndGetExtensionState = () => {
    tsvscode.postMessage({ type: 'reloadAndGetExtensionState', value: null });
  };

  const getSidebarLoadingStatus = () => {
    let response = SidebarLoadingStatus.LOADING;

    if (!loading) {
      response = SidebarLoadingStatus.LOADING_COMPLETE;
    }

    tsvscode.postMessage({
      type: 'getSidebarLoadingStatus',
      value: response,
    });
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'getExtensionState':
        handleGetExtensionState(message.value);
        break;
      case 'reloadAndGetExtensionState':
        handleGetExtensionState(message.value);
        break;
      case 'getSidebarLoadingStatus':
        getSidebarLoadingStatus();
        break;
      case 'viewFileThreads':
        $page = Page.ThreadsViewer;
        $activeView = ActiveView.CurrentFileThreads;
        break;
      case 'viewThread':
        $threadSelected = message.value;
        $page = Page.ReplyViewer;
        break;
      case 'logout':
        handleGetExtensionState(message.value);
        break;
    }
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);

    getExtensionState();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<div class="sidebar-container">
  {#if loading}
    <div>loading...</div>
  {:else if error}
    <div>Could not reach server. Please try again later!</div>
    <button on:click={reloadAndGetExtensionState}>Reload</button>
  {:else if $page === Page.Login}
    <button on:click={authenticate}>Login</button>
  {:else}
    <ViewerTopBar reload={reloadAndGetExtensionState} {logout} />

    {#if $page === Page.RegisterEmail}
      <RegisterEmail />
    {:else if $page === Page.NoFolderOrFile}
      <div>Open a file or a folder to use doclin features.</div>
    {:else if $page === Page.AccessRequired}
      <AccessRequired />
    {:else if $page === Page.InitializeOrganization}
      <InitializeOrganization />
    {:else if $page === Page.InitializeProject}
      <InitializeProject />
    {:else if $page === Page.ThreadsViewer}
      <ThreadsViewer />
    {:else if $page === Page.ReplyViewer}
      <ReplyViewer />
    {:else if $page === Page.SearchViewer}
      <SearchViewer />
    {:else if $page === Page.InviteUser}
      <InviteUser />
    {/if}
  {/if}
</div>
