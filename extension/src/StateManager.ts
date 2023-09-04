import * as vscode from "vscode";

enum StateType {
  AUTH_TOKEN = "authToken",
  CURRENT_PROJECT = "currentProject"
}

export class StateManager {
  static globalState: vscode.Memento;
  static type = StateType;

  static setState(key: StateType, value: string) {
    return this.globalState.update(key, value);
  }

  static getState(key: StateType): any {
    return this.globalState.get(key);
  }
}
