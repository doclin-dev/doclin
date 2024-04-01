import { GlobalStateType } from '../../enums';
import { Organization } from '../../types';
import CacheManager from './CacheManager';

export default class OrganizationCacheManager extends CacheManager<string, Organization> {
	constructor() {
		super(GlobalStateType.ORGANIZATION_MAP_CACHE);
	}
}