export enum Page {
  InitializeProject = "initializeProject",
  ThreadsViewer = "threadViewer",
  ReplyViewer = "replyViewer",
  Contact = "contact",
  InitializeOrganization = "initializeOrganization",
  Login = "login",
  NotGitRepo = "notGitRepo",
  AccessRequired = "accessRequired",
  InviteUser = "inviteUser",
  RegisterEmail = "registerEmail"
}

export enum ActiveTextEditor {
  ThreadsViewerTextEditor = 1,
  ReplyViewerTextEditor = 2,
  ThreadTextEditor = 3,
  ReplyTextEditor = 4,
}

export enum IntializeOrganizationView {
  CreateOrganization = "createOrganization",
  EnterInvitation = "enterInvitation",
  JoinOrganization = "joinOrganization"
}

export enum ActiveView {
  AllThreads = 0,
  CurrentFileThreads = 1,
}