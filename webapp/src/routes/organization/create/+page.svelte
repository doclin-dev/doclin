<script lang="ts">
  import { apiService } from '$lib/apiService';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { LAST_VISITED_ORGANIZATION_ID } from '$lib/localStorageKeys';
  import { fetchUser } from '$lib/stores/user';

  let name: string = '';

  onMount(() => {
    localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, '');
  });

  const handleSubmit = async (): Promise<void> => {
    const response = await apiService.organization.postOrganization(name);
    const organization: OrganizationDTO = response.data;
    await fetchUser();
    goto(`/organization/${organization.id}/project/create`);
  };
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="border border-gray-700 rounded-lg p-8 max-w-sm w-full">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">Create Organization</h1>
    </div>
    <form on:submit={handleSubmit}>
      <div class="mb-4">
        <label for="organization-name" class="block text-sm font-medium mb-2"> Organization Name </label>
        <input
          id="organization-name"
          type="text"
          bind:value={name}
          placeholder="Enter organization name"
          class="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <button
        type="submit"
        class="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-300"
      >
        Create Organization
      </button>
    </form>
  </div>
</div>
