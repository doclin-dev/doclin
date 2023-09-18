import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseAuthUrl = "/auth";

const getAuthenticatedUser = async () => {
    console.log(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseAuthUrl + "/user");

    return response;
}

export default {
    getAuthenticatedUser
}