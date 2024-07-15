import { GlobalStateType } from '../../enums';
import { CopilotMessage } from '../../types';
import CacheManager from './CacheManager';

export default class CopilotMessageCacheManager extends CacheManager<string, CopilotMessage[]> {
  constructor() {
    super(GlobalStateType.RELATIVE_FILE_PATH_MAP_CACHE);
  }
}
