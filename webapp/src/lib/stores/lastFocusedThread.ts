import { writable } from 'svelte/store';

export const lastFocusedThread = writable<number | undefined>();
