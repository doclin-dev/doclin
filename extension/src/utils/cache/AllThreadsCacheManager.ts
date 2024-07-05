import { GlobalStateType } from '../../enums';
import type { Thread } from '../../types';
import CacheManager from './CacheManager';

const ONE_DAY_TTL: number = 24 * 60 * 60 * 1000;

export default class AllThreadsCacheManager extends CacheManager<number, Thread[]> {
  constructor() {
    super(GlobalStateType.ALL_THREADS_MAP_CACHE, ONE_DAY_TTL);
  }
}
