import type { WebviewStateType } from "./enums";

export class WebviewStateManager {
  static setState(key: WebviewStateType, value: any) {
    console.log("setState " + key + " " + value);
    return tsvscode.setState({...tsvscode.getState(), [key]: value});
  }

  static getState(key: WebviewStateType): any {
    return tsvscode.getState() ? tsvscode.getState()[key] : null;
  }
}
