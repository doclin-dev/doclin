import { OrganizationDTO } from '$shared/types/OrganizationDTO';
import { GlobalStateType } from '../../enums';
import CacheManager from './CacheManager';

const THIRTY_DAYS_TTL = 30 * 24 * 60 * 60 * 1000;

export default class OrganizationCacheManager extends CacheManager<string, OrganizationDTO> {
  constructor() {
    super(GlobalStateType.ORGANIZATION_MAP_CACHE, THIRTY_DAYS_TTL);
  }
}
