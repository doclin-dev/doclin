import { GlobalStateType } from "../../enums";
import CacheManager from "./CacheManager";

export default class DoclinRelativePathCacheManager extends CacheManager<string, string> {
	constructor() {
		super(GlobalStateType.RELATIVE_FILE_PATH_MAP_CACHE);
	}
}