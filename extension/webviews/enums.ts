export enum Page {
  InitializeProject = 'initializeProject',
  ThreadsViewer = 'threadViewer',
  ReplyViewer = 'replyViewer',
  Contact = 'contact',
  InitializeOrganization = 'initializeOrganization',
  Login = 'login',
  NoFolderOrFile = 'noFolderOrFileOpened',
  AccessRequired = 'accessRequired',
  InviteUser = 'inviteUser',
  RegisterEmail = 'registerEmail',
  SearchViewer = 'searchViewer',
}

export enum TextEditorType {
  ThreadsViewerTextEditor = 1,
  ReplyViewerTextEditor = 2,
  ThreadTextEditor = 3,
  ReplyTextEditor = 4,
}

export enum IntializeOrganizationView {
  CreateOrganization = 'createOrganization',
  EnterInvitation = 'enterInvitation',
  JoinOrganization = 'joinOrganization',
}

export enum ActiveView {
  AllThreads = 0,
  CurrentFileThreads = 1,
}

export enum WebviewStateType {
  PAGE = 'page',
  CURRENT_ORGANIZATION = 'currentOrganization',
  CURRENT_PROJECT = 'currentProject',
  THREAD_CONTENTS = 'threadContents',
  REPLY_CONTENTS = 'replyContents',
  THREAD_SELECTED = 'threadSelected',
  ACTIVE_TEXT_EDITOR = 'activeTextEditor',
  ACTIVE_VIEW = 'activeView',
  COPILOT_MESSAGES = 'copilotMessages',
  COPILOT_REFER_TO_DOCLIN_THREADS = 'copilotReferToDoclinThreads',
  COPILOT_REFER_TO_CODE_FILE = 'referToCodeFile',
}

export enum SidebarLoadingStatus {
  LOADING = 1,
  LOADING_COMPLETE = 2,
}

export enum CopilotRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}
