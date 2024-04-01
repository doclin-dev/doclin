import { GlobalStateType } from "../../enums";
import type { Thread } from "../../types";
import CacheManager from "./CacheManager";

const DEFAULT_TTL: number = 24 * 60 * 60 * 1000;

export default class AllThreadsCacheManager extends CacheManager<number, Thread[]> {
	constructor() {
		super(GlobalStateType.ALL_THREADS_MAP_CACHE, DEFAULT_TTL);
	}
}