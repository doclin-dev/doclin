<script>
  import { fetchUser, user } from '$lib/stores/user';
  import { onMount } from 'svelte';

  onMount(async () => {
    await fetchUser();
  });
</script>

<h1 class="text-3xl font-bold underline">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{$user?.name}
