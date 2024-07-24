<script lang="ts">
	import snarkdown from 'snarkdown';
	import { copilotMessages } from '../../state/store';
	import { CopilotRole } from '../../enums';
</script>

<div class="copilot-messages-body">
	{#each $copilotMessages as message}
		{#if message.role === CopilotRole.USER}
		<b>You</b>
		<br />
		{message.content}
		{:else if message.role === CopilotRole.ASSISTANT}
		<b>Copilot</b>
		<br />
		{@html snarkdown(message.content)}
		{/if}
		<hr />
	{/each}
</div>