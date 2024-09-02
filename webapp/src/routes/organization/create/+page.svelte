<script lang="ts">
  let name: string = '';

  const handleSubmit = async (event: Event): Promise<void> => {};
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Create Organization</h1>
      <p class="text-gray-600">Enter the name of the new organization</p>
    </div>
    <form on:submit={handleSubmit}>
      <div class="mb-4">
        <label for="organization-name" class="block text-gray-700 text-sm font-medium mb-2"> Organization Name </label>
        <input
          id="organization-name"
          type="text"
          bind:value={name}
          placeholder="Enter organization name"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <button
        type="submit"
        class="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
      >
        Create Organization
      </button>
    </form>
  </div>
</div>
