import { OrganizationRepository } from '../database/repositories/OrganizationRepository';
import { Organization } from '../database/entities/Organization';
import { UserRepository } from '../database/repositories/UserRepository';
import { AppDataSource } from '../database/dataSource';
import { Request, Response } from 'express';
import { mapUser } from './utils/mapperUtils';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const getOrganizations = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    throw Error('userId is not defined');
  }

  const organizations = await OrganizationRepository.findOrganizationsByUserId(userId);

  const responseOrganizations = organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
  }));

  return res.send({ organizations: responseOrganizations });
};

export const postOrganization = async (req: Request, res: Response) => {
  const name = DOMPurify.sanitize(req.body.name);
  const organization = Organization.create({ name: name });

  const userId = req.userId;

  if (!userId) {
    throw Error('userId is not defined');
  }

  const user = await UserRepository.findUserById(userId);

  if (!user) {
    throw Error('user do not exist');
  }

  organization.users = [user];
  await AppDataSource.manager.save(organization);

  const members = await UserRepository.findUsersByOrganizationId(organization.id);

  const responseOrganization = {
    id: organization.id,
    name: organization.name,
    members: members.map(mapUser),
  };

  return res.send({ organization: responseOrganization });
};

export const getOrganization = async (req: Request, res: Response) => {
  const organizationId: string = req.params.organizationId;
  const includeMembers: boolean = req.query.includeMembers === 'true';

  const organization = await OrganizationRepository.findOrganizationById(organizationId);

  if (!organization) {
    res.send({ organization: null });
    return;
  }

  let members;

  if (includeMembers) {
    members = await UserRepository.findUsersByOrganizationId(organizationId);
  }

  const responseOrganization = {
    id: organization.id,
    name: organization.name,
    members: members?.map(mapUser),
  };

  res.send({ organization: responseOrganization });
};
