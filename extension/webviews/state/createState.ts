import { Writable, writable } from 'svelte/store';
import type { WebviewStateType } from '../enums';
import { WebviewStateManager } from './WebviewStateManager';

export function createState<T>(type?: WebviewStateType, initialValue?: T): Writable<T> {
    const vscodeStateValue = type ? WebviewStateManager.getState(type) : null;

    const store = writable<T>(vscodeStateValue ?? initialValue);

    const set = (value: T): void => {
        if (type) {
            WebviewStateManager.setState(type, value);
        }

    	store.set(value);
    }

    return {
    	...store,
    	set
    };
}