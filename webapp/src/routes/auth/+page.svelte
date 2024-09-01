<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let token: string | null = null;

  $: token = $page.data.token;

  onMount(() => {
    if (token) {
      // Store the token in localStorage
      // Redirect to the homepage
    }
  });
</script>

<p>Redirecting...</p>
