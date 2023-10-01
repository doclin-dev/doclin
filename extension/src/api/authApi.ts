import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseAuthUrl = "/auth";

const getAuthenticatedUser = async () => {
    const apiService = createAxiosInstance();
    const response = await apiService.get(baseAuthUrl + "/user");

    return response;
}

export default {
    getAuthenticatedUser
}