import { GlobalStateManager } from "../GlobalStateManager";
import { GlobalStateType } from "../enums";
import type { Thread } from "../types";
import logger from "./logger";

export const getCachedThreads = async (activeFilePath: string): Promise<Thread[] | undefined> => {
	try {
		const threadsMap: Map<string, Thread[]> = await getThreadMapFromState();

		return threadsMap.get(activeFilePath);

	} catch (error) {
		logger.error(`Error during getting cached threads ${error}`);
		GlobalStateManager.setState(GlobalStateType.CACHED_THREADS_MAP, null);
	}
};

export const storeThreadsCache = async (activeFilePath: string, threads: Thread[]): Promise<void> => {
	try {
		const threadsMap: Map<string, Thread[]> = await getThreadMapFromState();
		threadsMap.set(activeFilePath, threads);
		storeThreadMapToState(threadsMap);

	} catch (error) {
		logger.error(`Error during storing cached threads ${error}`);
		GlobalStateManager.setState(GlobalStateType.CACHED_THREADS_MAP, null);
	}
};

export const clearThreadsCache = async (activeFilePath: string) => {
	try {
		const threadsMap: Map<string, Thread[]> = await getThreadMapFromState();
		threadsMap.delete(activeFilePath);
		storeThreadMapToState(threadsMap);

	} catch (error) {
		logger.error(`Error during clearing cached threads ${error}`);
		GlobalStateManager.setState(GlobalStateType.CACHED_THREADS_MAP, null);
	}
};

export const clearFileThreadsCache = async() => {
	GlobalStateManager.setState(GlobalStateType.CACHED_THREADS_MAP, null);
};

const getThreadMapFromState = async (): Promise<Map<string, Thread[]>> => {
	const serializedThreadsMap: string = await GlobalStateManager.getState(GlobalStateType.CACHED_THREADS_MAP);

	if (serializedThreadsMap) {
		return new Map<string, Thread[]>(JSON.parse(serializedThreadsMap));
	} else {
		return new Map<string, Thread[]>();
	}
};

const storeThreadMapToState = async (threadsMap: Map<string, Thread[]>) => {
	await GlobalStateManager.setState(GlobalStateType.CACHED_THREADS_MAP, stringifyMap(threadsMap));
};

const stringifyMap = (map: Map<string, Thread[]>) => {
	return JSON.stringify(Array.from(map.entries()));
};