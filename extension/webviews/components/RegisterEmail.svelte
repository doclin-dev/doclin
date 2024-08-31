<script lang="ts">
  let email: string = '';
  let errorMessage: string = '';

  const registerEmail = async () => {
    if (!isValidEmail(email)) {
      errorMessage = 'Please enter a valid email address.';
      return;
    }
    errorMessage = '';

    tsvscode.postMessage({ type: 'registerEmail', value: { email: email } });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
</script>

<form on:submit|preventDefault={registerEmail}>
  <input placeholder="Register your email" bind:value={email} required />
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
  <button>Submit</button>
</form>
