import axios, { AxiosInstance } from 'axios';
import { ThreadApiService } from './ThreadApiService';
import { ApiServiceOptions } from '../types/ApiServiceOptions';
import { AuthApiService } from './AuthApiService';
import { CopilotApiService } from './CopilotApiService';
import { InvitationApiService } from './InvitationApiService';
import { ProjectApiService } from './ProjectApiService';
import { LoggerApiService } from './LoggerApiService';
import { ReplyApiService } from './ReplyApiService';
import { OrganizationApiService } from './OrganizationApiService';

export class ApiService {
  public axiosInstance: AxiosInstance;
  public auth: AuthApiService;
  public organization: OrganizationApiService;
  public project: ProjectApiService;
  public thread: ThreadApiService;
  public reply: ReplyApiService;
  public copilot: CopilotApiService;
  public invitation: InvitationApiService;
  public logger: LoggerApiService;

  constructor(options: ApiServiceOptions) {
    this.axiosInstance = axios.create({ baseURL: options.baseURL, withCredentials: options.withCredentials });
    this.setToken(options.token);

    this.auth = new AuthApiService(this.axiosInstance);
    this.organization = new OrganizationApiService(this.axiosInstance);
    this.project = new ProjectApiService(this.axiosInstance);
    this.thread = new ThreadApiService(this.axiosInstance);
    this.reply = new ReplyApiService(this.axiosInstance);
    this.copilot = new CopilotApiService(this.axiosInstance);
    this.invitation = new InvitationApiService(this.axiosInstance);
    this.logger = new LoggerApiService(this.axiosInstance);
  }

  public setToken(token: string | undefined) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }
}
