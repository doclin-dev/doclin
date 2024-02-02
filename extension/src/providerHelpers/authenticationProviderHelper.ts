import * as vscode from "vscode";
import { API_BASE_URL, PRODUCTION } from "../envConstants";
import * as polka from "polka";
import { SecretStorageManager } from "../SecretStorageManager";
import authApi from "../api/authApi";
import { SecretStorageType } from "../enums";

const AUTH_URL = vscode.Uri.parse(`${API_BASE_URL}/auth/github`);

const app = polka();

export const authenticate = (fn?: () => void) => {
  try {
    app.server?.close();

    app.get(`/auth`, (req, res) => getToken(req, res, fn));

    app.listen(54321, openApiUrl);
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage("Doclin: An error occured when listening for authentication response");
  }
};

const getToken = async (req: any, res: any, fn?: () => void) => {
  try {
    const token = req.query.token;

    if (!token) {
      res.end(`Authentication unsuccessful. Please try again later.`);
      vscode.window.showInformationMessage("Doclin: Authentication unsuccessful.");
      app.server?.close();
      return;
    }

    await setTokenToStorage(token);

    if (fn) {
      fn();
    }

    res.end(`Authentication successful. You can close this now!`);
    vscode.window.showInformationMessage("Doclin: Authentication successful.");

    app.server?.close();
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage(`Doclin: An error occured when receiving token`);
  }
}

const openApiUrl = (err: Error) => {
  if (err) {
    vscode.window.showErrorMessage(err.message);
  }
  
  vscode.commands.executeCommand("vscode.open", AUTH_URL);
}

export const getAuthenticatedUser = async () => {
  const response = await authApi.getAuthenticatedUser();
  const payload = response?.data;
  const user = payload?.user;

  return user;
}

const setTokenToStorage = async (token: string|null) => {
  if (PRODUCTION) {
    await SecretStorageManager.store(SecretStorageType.PROD_AUTH_TOKEN, token);
  } else {
    await SecretStorageManager.store(SecretStorageType.DEV_AUTH_TOKEN, token);
  }
}

export const logout = async () => {
  await setTokenToStorage("");
}