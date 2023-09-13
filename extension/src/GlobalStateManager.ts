import * as vscode from "vscode";

enum StateType {
  AUTH_TOKEN = "authToken",
}

export class GlobalStateManager {
  static globalState: vscode.Memento;
  static type = StateType;

  static setState(key: StateType, value: any) {
    return this.globalState.update(key, value);
  }

  static getState(key: StateType): any {
    return this.globalState.get(key);
  }
}
