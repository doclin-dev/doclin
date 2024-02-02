import { Log } from "./database/entities/Log";
import { LogType } from "./types/enums";

const info = async (message: string, userId?: number): Promise<void> => {
    console.log(message);
    await Log.create({
        type: LogType.info,
        message: message,
        userId: userId
    }).save();
}

const warning = async (message: string, userId?: number): Promise<void> => {
    console.warn(message);
    await Log.create({
        type: LogType.warning,
        message: message,
        userId: userId
    }).save();
}

const error = async (message: string, userId?: number): Promise<void> => {
    console.error(message);
    await Log.create({
        type: LogType.error,
        message: message,
        userId: userId
    }).save();
}

export default {
    info,
    warning,
    error
}