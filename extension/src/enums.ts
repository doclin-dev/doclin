export enum SecretStorageType {
    PROD_AUTH_TOKEN = "authToken",
    DEV_AUTH_TOKEN = "devToken"
}

export enum GlobalStateType {
    DOCLIN_FOLDER = "doclinFolder",
    CACHED_THREADS_MAP = "cachedThreadsMap"
}

export enum LogType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}

export enum SidebarLoadingStatus {
    UNMOUNTED = "unmounted",
    LOADING = "loading",
    LOADING_COMPLETE = "loadingComplete"
}