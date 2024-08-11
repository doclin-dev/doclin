<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Page } from '../../enums';
  import { currentProject, page } from '../../state/store';
  import { Project } from '../../types';

  export let newProjectView: boolean;
  export let existingProjects: Project[] = [];
  let postProjectName: string = '';
  let privateProject: boolean = true;
  let error: string = '';

  const CREATE_NEW_PROJECT: string = 'Create New Project';
  const EMPTY_STRING_ERROR: string = 'Project name cannot be empty!';
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
      case 'postProject':
        $currentProject = message.value;
        $page = Page.ThreadsViewer;
        break;
    }
  };

  function handleRadioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
    privateProject = input.value === 'true';
  }

  const createNewProject = async () => {
    if (!postProjectName) {
      error = EMPTY_STRING_ERROR;
      return;
    }

    tsvscode.postMessage({ type: 'postProject', value: { name: postProjectName, privateProject: privateProject } });
  };

  const setViewToJoinExistingProject = () => {
    newProjectView = false;
  };
</script>

<h3>{CREATE_NEW_PROJECT}:</h3>

<form>
  <input class="my-1" placeholder="Enter project name" bind:value={postProjectName} />

  <div>
    <label>
      <input type="radio" value="false" on:change={handleRadioChange} checked={privateProject === false} />
      Public
    </label>

    <label>
      <input type="radio" value="true" on:change={handleRadioChange} checked={privateProject === true} />
      Private
    </label>
  </div>

  <button on:click|preventDefault={createNewProject}>Submit</button>
  <div class="text-danger">{error}</div>
</form>

<div class="mt-2">
  <i>{INITIALIZE_MESSAGE}</i>
</div>

<hr />

{#if existingProjects.length > 0}
  <button on:click|preventDefault={setViewToJoinExistingProject}>{JOIN_EXISTING_PROJECT}</button>
{/if}
