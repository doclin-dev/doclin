import { TextEditorType, ActiveView, Page, WebviewStateType } from '../enums';
import type { Project, Organization, Thread } from '../types';
import { createState } from './createState';

export const editedThreadId = createState<number|null>(null, null);

export const editedReplyId = createState<number|null>(null, null);

export const page = createState<Page>(WebviewStateType.PAGE);

export const currentProject = createState<Project|null>(WebviewStateType.CURRENT_PROJECT);

export const currentOrganization = createState<Organization|null>(WebviewStateType.CURRENT_ORGANIZATION);

export const threadContents = createState(WebviewStateType.THREAD_CONTENTS);

export const replyContents = createState(WebviewStateType.REPLY_CONTENTS);

export const threadSelected = createState<Thread|null>(WebviewStateType.THREAD_SELECTED);

export const githubUrl = createState<string>(WebviewStateType.GITHUB_URL);

export const activeTextEditor = createState<TextEditorType>(WebviewStateType.ACTIVE_TEXT_EDITOR);

export const activeView = createState<ActiveView>(WebviewStateType.ACTIVE_VIEW);

export const reload = createState<number>(null, 0);