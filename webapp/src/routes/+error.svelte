<script>
  import { page } from '$app/stores';
</script>

<main class="h-screen flex flex-col justify-center items-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">Sorry, an error occurred</h1>
    <p class="text-2xl font-light mb-8">{$page.error?.message}</p>
    <a href="/" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg"> Go back home </a>
  </div>
</main>
