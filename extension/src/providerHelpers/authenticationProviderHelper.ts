import * as vscode from "vscode";
import { API_BASE_URL } from "../envConstants";
import * as polka from "polka";
import { GlobalStateManager } from "../GlobalStateManager";
import authApi from "../api/authApi";

export const authenticate = (fn?: () => void) => {
  const app = polka();

  app.get(`/auth/:token`, async (req, res) => {
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

    (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${API_BASE_URL}/auth/github`)
      );
    }
  });
};

export const getAuthenticatedUser = async () => {
  const response = await authApi.getAuthenticatedUser();
  const payload = response?.data;
  const user = payload?.user;

  return user;
}