import { GlobalStateType } from '../../enums';
import { CopilotIndicators } from '../../types';
import CacheManager from './CacheManager';

export default class CopilotIndicatorCacheManager extends CacheManager<string, CopilotIndicators> {
  constructor() {
    super(GlobalStateType.COPILOT_INDICATORS_MAP_CACHE);
  }
}
