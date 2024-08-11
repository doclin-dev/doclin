<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Page } from '../../enums';
  import { currentProject, page } from '../../state/store';
  import { Project } from '../../types';

  export let newProjectView: boolean;
  export let existingProjects: Project[] = [];

  const CREATE_NEW_PROJECT: string = 'Create New Project';
  const JOIN_EXISTING_PROJECT: string = 'Join Existing Project';
  const INITIALIZE_MESSAGE: string = "This will update your '.doclin' file with your project details.";

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'setCurrentProject':
        $page = Page.ThreadsViewer;
        break;
    }
  };

  const setViewToCreateProject = () => {
    newProjectView = true;
  };

  const setCurrentProject = (project: Project) => {
    tsvscode.postMessage({ type: 'setCurrentProject', value: project.id });
    $currentProject = project;
  };
</script>

<div class="my-2">
  <h3>{JOIN_EXISTING_PROJECT}:</h3>

  <ul>
    {#each existingProjects as project (project.id)}
      <li>
        <a href="/" on:click|preventDefault={() => setCurrentProject(project)}> {project.name} </a>
      </li>
    {/each}
  </ul>
</div>

<div class="mt-2">
  <i>{INITIALIZE_MESSAGE}</i>
</div>

<hr />

<button on:click|preventDefault={setViewToCreateProject}>{CREATE_NEW_PROJECT}</button>
