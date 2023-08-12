import { writable } from 'svelte/store';

export const editedThreadId = writable(null);

export const selectedThread = writable(null);