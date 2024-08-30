<script lang="ts">
  import type { Project } from '../types';
  import { onMount, onDestroy } from 'svelte';
  import { Page } from '../enums';
  import { currentOrganization, page } from '../state/store';
  import CreateProject from './project/CreateProject.svelte';
  import JoinExistingProject from './project/JoinExistingProject.svelte';

  let existingProjects: Project[] = [];
  let newProjectView: boolean;

  const fetchExistingProjects = async () => {
    tsvscode.postMessage({ type: 'getExistingProjects', value: null });
  };

  const setView = (existingProjects: Project[]) => {
    if (existingProjects.length > 0) {
      newProjectView = false;
    } else {
      newProjectView = true;
    }
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'getExistingProjects':
        existingProjects = message.value;
        setView(existingProjects);
        break;
    }
  };

  const chooseAnotherOrganization = () => {
    $currentOrganization = null;
    $page = Page.InitializeOrganization;
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);

    fetchExistingProjects();
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<div class="pt-2">
  {#if newProjectView === true}
    <CreateProject bind:newProjectView bind:existingProjects />
  {:else}
    <JoinExistingProject bind:newProjectView bind:existingProjects />
  {/if}

  <button
    on:click={() => {
      chooseAnotherOrganization();
    }}>Change Organization: {$currentOrganization?.name}</button
  >
</div>
