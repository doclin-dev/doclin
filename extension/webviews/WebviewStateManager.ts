enum StateType {
  CURRENT_ORGANIZATION = "currentOrganization",
  CURRENT_PROJECT = "currentProject",
  PAGE = "page",
  REPLY_MESSAGE = "replyMessage",
  THREAD_CONTENTS = "threadContents",
  THREAD_SELECTED = "threadSelected",
  GITHUB_URL = "githubUrl",
  ACTIVE_TEXT_EDITOR = "activeTextEditor",
  ACTIVE_VIEW = "activeView",
}

export class WebviewStateManager {
  static type = StateType;

  static setState(key: StateType, value: any) {
    return tsvscode.setState({...tsvscode.getState(), [key]: value});
  }

  static getState(key: StateType): any {
    return tsvscode.getState() ? tsvscode.getState()[key] : null;
  }
}
