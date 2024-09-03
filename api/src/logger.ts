import { Log } from './database/entities/Log';
import { PRODUCTION } from './envConstants';
import { LogType } from './types/enums';

const info = async (message: string, userId?: number): Promise<void> => {
  if (!PRODUCTION) {
    console.info(message);
  }
  await Log.create({
    type: LogType.INFO,
    message: message,
    userId: userId,
  }).save();
};

const warning = async (message: string, userId?: number): Promise<void> => {
  if (!PRODUCTION) {
    console.warn(message);
  }
  await Log.create({
    type: LogType.WARNING,
    message: message,
    userId: userId,
  }).save();
};

const error = async (message: string, userId?: number): Promise<void> => {
  if (!PRODUCTION) {
    console.error(message);
  }
  await Log.create({
    type: LogType.ERROR,
    message: message,
    userId: userId,
  }).save();
};

export default {
  info,
  warning,
  error,
};
