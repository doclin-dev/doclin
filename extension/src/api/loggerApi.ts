import { LogType } from "../enums";
import { createAxiosInstance } from "./apiService";

const LOG_BASE_URL = "/log";

const postLog = async (type: LogType, message: string) => {

    const data = {
        type,
        message
    };

    const apiService = await createAxiosInstance();
    const response = await apiService.post(LOG_BASE_URL, data);

    return response;
}

export default {
    postLog
}