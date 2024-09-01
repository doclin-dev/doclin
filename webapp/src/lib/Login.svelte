<script>
  import Icon from '@iconify/svelte';
  import githubIcon from '@iconify/icons-mdi/github';
  import { API_URL } from '../envConstants';

  const GITHUB_OAUTH_URL = `${API_URL}/auth/github/webapp`;

  const handleLogin = () => {
    window.location.href = GITHUB_OAUTH_URL;
  };
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Login</h1>
      <p class="text-gray-600">Sign in with your GitHub account</p>
    </div>
    <button
      on:click={handleLogin}
      class="flex items-center justify-center w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
    >
      <Icon icon={githubIcon} class="h-5 w-5 mr-2" />
      <span>Sign in with GitHub</span>
    </button>
  </div>
</div>
