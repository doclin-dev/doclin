<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let email: string = '';
  let errorMessage: string = '';

  const submitEmailRegistration = async () => {
    if (!isValidEmail(email)) {
      errorMessage = 'Please enter a valid email address.';
      return;
    }
    errorMessage = '';

    tsvscode.postMessage({ type: 'postUserEmail', value: { email: email } });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const reloadAndGetExtensionState = () => {
    tsvscode.postMessage({ type: 'reloadAndGetExtensionState', value: undefined });
  };

  const messageEventListener = async (event: any) => {
    const message = event.data;
    switch (message.type) {
      case 'postUserEmail':
        if (message.value === 200) {
          reloadAndGetExtensionState();
        }
        break;
    }
  };

  onMount(async () => {
    window.addEventListener('message', messageEventListener);
  });

  onDestroy(() => {
    window.removeEventListener('message', messageEventListener);
  });
</script>

<form on:submit|preventDefault={submitEmailRegistration}>
  <input placeholder="Register your email" bind:value={email} required />
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
  <button>Submit</button>
</form>
