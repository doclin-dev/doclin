import * as vscode from "vscode";
import { API_BASE_URL } from "../envConstants";
import * as polka from "polka";
import { GlobalStateManager } from "../GlobalStateManager";
import authApi from "../api/authApi";

const AUTH_URL = vscode.Uri.parse(`${API_BASE_URL}/auth/github`);

const app = polka();

export const authenticate = (fn?: () => void) => {
  app.server?.close();

  app.get(`/auth/:token`, (req, res) => getToken(req, res, fn));

  app.listen(54321, openApiUrl);
};

const getToken = async (req: any, res: any, fn?: () => void) => {
  const { token } = req.params;
  
  if (!token) {
    res.end(`<h1>Something went wrong!</h1>`);
    return;
  }

  await GlobalStateManager.setState(GlobalStateManager.type.AUTH_TOKEN, token);

  if (fn) {
    fn();
  }

  res.end(`<h1>Authentication was successful, you can close this now!</h1>`);

  app.server?.close();
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