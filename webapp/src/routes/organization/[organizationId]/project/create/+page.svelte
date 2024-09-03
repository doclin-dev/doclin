<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { apiService } from '$lib/apiService';
  import { organization } from '$lib/stores/organization';
  import type { ProjectDTO } from '../../../../../../../shared/types/ProjectDTO';

  let name = '';
  let privateProject = false; // Default to 'public'

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if ($organization) {
      const response = await apiService.project.postProject($organization.id, name, privateProject);
      const project: ProjectDTO = response.data;
      goto(`/organization/${$organization.id}/project/${project.id}`);
    }
  };
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Create a New Project</h1>

    <form on:submit={handleSubmit}>
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-medium mb-1">Project Name</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Enter project name"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <fieldset class="mb-4">
        <legend class="text-gray-700 text-sm font-medium mb-2">Visibility</legend>
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input id="public" type="radio" value="false" bind:group={privateProject} class="form-radio" />
            <span class="ml-2 text-sm">Public</span>
          </label>

          <label class="flex items-center">
            <input
              id="private"
              type="radio"
              value="true"
              bind:group={privateProject}
              checked={privateProject}
              class="form-radio"
            />
            <span class="ml-2 text-sm">Private</span>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
      >
        Create Project
      </button>
    </form>
  </div>
</div>
