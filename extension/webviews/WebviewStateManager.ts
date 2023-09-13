enum StateType {
  CURRENT_PROJECT = "currentProject",
  THREAD_MESSAGE = "threadMessage",
  PAGE = "page",
  THREAD_SELECTED = "threadSelected",
  REPLY_MESSAGE = "replyMessage",
}

export class WebviewStateManager {
  static type = StateType;

  static setState(key: StateType, value: any) {
    return tsvscode.setState({...tsvscode.getState(), [key]: value});
  }

  static getState(key: StateType): any {
    return tsvscode.getState()[key];
  }
}
