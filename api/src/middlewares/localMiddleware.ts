import { NextFunction, Request, Response } from 'express';
import { PRODUCTION } from '../envConstants';
import logger from '../logger';

export const printEndpointsOnLocal = (req: Request, _res: Response, next: NextFunction) => {
  if (!PRODUCTION) {
    logger.info(`${req.method} ${req.url}`);
    next();
  }
};
