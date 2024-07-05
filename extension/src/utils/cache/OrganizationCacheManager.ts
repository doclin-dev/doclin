import { GlobalStateType } from '../../enums';
import { Organization } from '../../types';
import CacheManager from './CacheManager';

const THIRTY_DAYS_TTL = 30 * 24 * 60 * 60 * 1000;

export default class OrganizationCacheManager extends CacheManager<string, Organization> {
  constructor() {
    super(GlobalStateType.ORGANIZATION_MAP_CACHE, THIRTY_DAYS_TTL);
  }
}
