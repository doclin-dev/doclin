import { NextFunction, Request, Response } from 'express';
import { OrganizationRepository } from '../database/repositories/OrganizationRepository';

export const verifyOrganizationAccess = async (req: Request, res: Response, next: NextFunction) => {
  const organizationId: string = req.params.organizationId;
  const userId = req.userId;

  if (!userId) {
    res.status(401).send('Unauthenticated');
    return;
  }

  const userExists = await OrganizationRepository.checkUserExistsInOrganization(organizationId, userId);

  if (!userExists) {
    res.status(403).send('Unauthorized');
    return;
  }

  next();
};
