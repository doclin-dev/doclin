import { TextEditorType, ActiveView, Page, WebviewStateType } from '../enums';
import type { Project, Organization, Thread, User } from '../types';
import type { CopilotMessageDTO } from '../../../shared/types/CopilotMessageDTO';
import { createState } from './createState';

export const currentUser = createState<User | null>(WebviewStateType.CURRENT_USER);

export const editedThreadId = createState<number | null>(null, null);

export const editedReplyId = createState<number | null>(null, null);

export const page = createState<Page>(WebviewStateType.PAGE);

export const currentProject = createState<Project | null>(WebviewStateType.CURRENT_PROJECT);

export const currentOrganization = createState<Organization | null>(WebviewStateType.CURRENT_ORGANIZATION);

export const threadContents = createState(WebviewStateType.THREAD_CONTENTS);

export const replyContents = createState(WebviewStateType.REPLY_CONTENTS);

export const threadSelected = createState<Thread | null>(WebviewStateType.THREAD_SELECTED);

export const activeTextEditor = createState<TextEditorType>(WebviewStateType.ACTIVE_TEXT_EDITOR);

export const activeView = createState<ActiveView>(WebviewStateType.ACTIVE_VIEW, ActiveView.AllThreads);

export const reload = createState<number>(null, 0);

export const copilotMessages = createState<CopilotMessageDTO[]>(WebviewStateType.COPILOT_MESSAGES, []);

export const copilotReferToDoclinThreads = createState<boolean>(WebviewStateType.COPILOT_REFER_TO_DOCLIN_THREADS, true);

export const copilotReferToCodeFile = createState<boolean>(WebviewStateType.COPILOT_REFER_TO_CODE_FILE, true);
