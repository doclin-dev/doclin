import { ApiService } from '$shared/apiService/ApiService';
import { API_URL } from '../envConstants';

export const apiService = new ApiService({ baseURL: API_URL, withCredentials: true });
