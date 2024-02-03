import { createAxiosInstance } from "./apiService";

const baseAuthUrl = "/auth/user";

const getAuthenticatedUser = async () => {
    const apiService = await createAxiosInstance();
    const response = await apiService.get(baseAuthUrl);

    return response;
}

const postUserEmail = async (email: string) => {
    const apiService = await createAxiosInstance();
    const response = await apiService.post(baseAuthUrl, email);
    return response;
}

export default {
    getAuthenticatedUser,
    postUserEmail
}