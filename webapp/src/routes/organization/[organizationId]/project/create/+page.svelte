<script lang="ts">
  import { goto } from '$app/navigation';
  import { apiService } from '$lib/apiService';
  import type { ProjectDTO } from '$shared/types/ProjectDTO';
  import { fetchOrganization } from '$lib/stores/organization';
  import { page } from '$app/stores';
  import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';

  const organizationId: string = $page.params.organizationId;
  let name = '';
  let privateProject = false;

  localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, organizationId);
  localStorage.setItem(LAST_VISITED_PROJECT_ID, 'create');

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const response = await apiService.project.postProject(organizationId, name, privateProject);
    const project: ProjectDTO = response.data;

    goto(`/organization/${organizationId}/project/${project.id}`);
    fetchOrganization(organizationId);
  };
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="rounded-lg p-8 max-w-md w-full border border-gray-700">
    <h1 class="text-2xl font-bold mb-4">Create a New Project</h1>

    <form on:submit={handleSubmit}>
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium mb-1">Project Name</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Enter project name"
          class="w-full bg-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <fieldset class="mb-4">
        <legend class="text-sm font-medium mb-2">Visibility</legend>
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input id="public" type="radio" value={false} bind:group={privateProject} class="form-radio" />
            <span class="ml-2 text-sm">Public</span>
          </label>

          <label class="flex items-center">
            <input id="private" type="radio" value={true} bind:group={privateProject} class="form-radio" />
            <span class="ml-2 text-sm">Private</span>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
      >
        Create Project
      </button>
    </form>
  </div>
</div>
