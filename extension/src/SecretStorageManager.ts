import { SecretStorage } from "vscode";
import { SecretStorageType } from "./enums";

export class SecretStorageManager {
  static secretStorage: SecretStorage;

  static async store(key: SecretStorageType, value: any) {
  	return await this.secretStorage.store(key, value);
  }

  static async get(key: SecretStorageType): Promise<any> {
  	return await this.secretStorage.get(key);
  }
}
