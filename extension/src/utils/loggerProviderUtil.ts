import logger from './logger';

export const onInfo = (message: any) => {
  logger.info(message.value, true);
};

export const onError = (message: any) => {
  logger.error(message.value, true);
};
