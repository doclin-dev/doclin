import { LogType } from '../enums/LogType';
import { AbstracApiService } from './AbstractApiService';

export class LoggerApiService extends AbstracApiService {
  private LOG_BASE_URL = '/log';

  public async postLog(type: LogType, message: string) {
    const data = {
      type,
      message,
    };

    const response = await this.axiosInstance.post(this.LOG_BASE_URL, data);

    return response;
  }
}
