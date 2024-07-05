import { GlobalStateType } from '../../enums';
import { User } from '../../types';
import CacheManager from './CacheManager';

const AUTHENTICATED_USER_KEY = 'authenticatedUser';

const THIRTY_DAYS_TTL = 30 * 24 * 60 * 60 * 1000;

export default class AuthenticatedUserCacheManager extends CacheManager<string, User> {
  constructor() {
    super(GlobalStateType.USER_MAP_CACHE, THIRTY_DAYS_TTL);
  }

  async getAuthenticatedUser(): Promise<User | undefined> {
    return await super.get(AUTHENTICATED_USER_KEY);
  }

  async setAuthenticatedUser(user: User): Promise<void> {
    await super.set(AUTHENTICATED_USER_KEY, user);
  }

  async clearAuthenticatedUser(): Promise<void> {
    await super.clear(AUTHENTICATED_USER_KEY);
  }
}
