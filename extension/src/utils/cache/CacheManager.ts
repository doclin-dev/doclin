import { GlobalStateType } from '../../enums';
import { GlobalStateManager } from '../../GlobalStateManager';
import { CacheEntry } from './CacheEntry';
import logger from '../logger';

const DEFAULT_TTL: number = 7 * 24 * 60 * 60 * 1000;

export default class CacheManager<K extends string | number, V> {
  private stateType: GlobalStateType;
  private defaultTtl: number;

  constructor(stateType: GlobalStateType, defaultTtl: number = DEFAULT_TTL) {
    this.stateType = stateType;
    this.defaultTtl = defaultTtl;
  }

  async get(key: K): Promise<V | undefined> {
    try {
      let cache: Record<K, CacheEntry<V>> = (await GlobalStateManager.getState(this.stateType)) ?? {};
      const entry = cache[key];

      if (entry && entry.expiry > Date.now()) {
        return entry.value;
      }

      await this.clear(key);
      return undefined;
    } catch (error) {
      logger.error(`Error during getting cache ${error}`);
      throw error;
    }
  }

  async set(key: K, value: V, ttl: number = this.defaultTtl): Promise<void> {
    try {
      let cache: Record<K, CacheEntry<V>> = (await GlobalStateManager.getState(this.stateType)) ?? {};

      cache[key] = {
        value: value,
        expiry: Date.now() + ttl,
      };

      await GlobalStateManager.setState(this.stateType, cache);
    } catch (error) {
      logger.error(`Error during setting cache ${error}`);
      throw error;
    }
  }

  async clear(key?: K): Promise<void> {
    try {
      if (key) {
        const cache: Record<K, V> = (await GlobalStateManager.getState(this.stateType)) ?? {};

        if (cache) {
          delete cache[key];
          await GlobalStateManager.setState(this.stateType, cache);
        }
      } else {
        await GlobalStateManager.setState(this.stateType, {});
      }
    } catch (error) {
      logger.error(`Error during clearing cache ${error}`);
      throw error;
    }
  }
}
