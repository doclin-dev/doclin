export enum SecretStorageType {
  PROD_AUTH_TOKEN = 'authToken',
  DEV_AUTH_TOKEN = 'devToken',
}

export enum GlobalStateType {
  DOCLIN_FOLDER = 'doclinFolder',
  ALL_THREADS_MAP_CACHE = 'allThreadsMapCache',
  FILE_THREADS_MAP_CACHE = 'fileThreadsMapsCache',
  RELATIVE_FILE_PATH_MAP_CACHE = 'relativeFilePathMapCache',
  ORGANIZATION_MAP_CACHE = 'organizationMapCache',
  PROJECT_MAP_CACHE = 'projectMapCache',
  USER_MAP_CACHE = 'authenticatedUserCache',
  COPILOT_MESSAGES_MAP_CACHE = 'copilotMessagesMapCache',
  COPILOT_INDICATORS_MAP_CACHE = 'copilotIndicatorsMapCache',
}

export enum SidebarLoadingStatus {
  UNMOUNTED = 0,
  LOADING = 1,
  LOADING_COMPLETE = 2,
}
