import { writable } from 'svelte/store';
import { WebviewStateManager } from '../WebviewStateManager';
import { ActiveTextEditor, ActiveView, Page, WebviewStateType } from '../enums';
import type { Project, Organization, Thread } from '../types';

const getState = WebviewStateManager.getState;

export const editedThreadId = writable(null);

export const editedReplyId = writable(null);

export const page = writable<Page>(getState(WebviewStateType.PAGE));

export const currentProject = writable<Project|null>(getState(WebviewStateType.CURRENT_PROJECT));

export const currentOrganization = writable<Organization|null>(getState(WebviewStateType.CURRENT_ORGANIZATION));

export const threadContents = writable(getState(WebviewStateType.THREAD_CONTENTS));

export const replyContents = writable(getState(WebviewStateType.REPLY_CONTENTS));

export const threadSelected = writable<Thread|null>(getState(WebviewStateType.THREAD_SELECTED));

export const githubUrl = writable<string>(getState(WebviewStateType.GITHUB_URL));

export const activeTextEditor = writable<ActiveTextEditor>(getState(WebviewStateType.ACTIVE_TEXT_EDITOR));

export const activeView = writable<ActiveView>(getState(WebviewStateType.ACTIVE_VIEW));
