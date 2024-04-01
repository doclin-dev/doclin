import { GlobalStateType } from "../../enums";
import type { Thread } from "../../types";
import CacheManager from "./CacheManager";

export default class FileThreadCacheManager extends CacheManager<string, Thread[]> {
	constructor() {
		super(GlobalStateType.FILE_THREADS_MAP_CACHE);
	}
}