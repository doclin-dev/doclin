import { Memento } from "vscode";
import { GlobalStateType } from "./enums";

export class GlobalStateManager {
	static globalState: Memento;

	static async setState(key: GlobalStateType, value: any) {
  	return await this.globalState.update(key, value);
	}

	static async getState(key: GlobalStateType): Promise<any> {
  	return await this.globalState.get(key);
	}
}
