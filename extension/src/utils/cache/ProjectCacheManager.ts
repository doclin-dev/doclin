import { GlobalStateType } from '../../enums';
import { Project } from '../../types';
import CacheManager from './CacheManager';

export default class ProjectCacheMananger extends CacheManager<number, Project> {
	constructor() {
		super(GlobalStateType.PROJECT_MAP_CACHE);
	}
}