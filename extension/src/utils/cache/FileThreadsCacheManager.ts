import { GlobalStateType } from '../../enums';
import type { Thread } from '../../types';
import CacheManager from './CacheManager';

const ONE_DAY_TTL: number = 24 * 60 * 60 * 1000;

export default class FileThreadCacheManager extends CacheManager<string, Thread[]> {
  constructor() {
    super(GlobalStateType.FILE_THREADS_MAP_CACHE, ONE_DAY_TTL);
  }
}
