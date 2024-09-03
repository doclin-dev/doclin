import { OrganizationRepository } from '../database/repositories/OrganizationRepository';
import { Organization } from '../database/entities/Organization';
import { UserRepository } from '../database/repositories/UserRepository';
import { AppDataSource } from '../database/dataSource';
import { Request, Response } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { User } from '../database/entities/User';
import { mapOrganizationToOrganizationDTO } from '../mappers/organizationToOrganizationDTOMapper';
import { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
import { OrganizationCreateDTO } from '../../../shared/types/OrganizationCreateDTO';
import { OrganizationGetQueryDTO } from '../../../shared/types/OrganizationGetQueryDTO';
import { ParamsDictionary } from '../types/ParamsDictionary';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const getOrganizations = async (
  req: Request<ParamsDictionary, OrganizationDTO[], {}>,
  res: Response<OrganizationDTO[]>
) => {
  const userId = req.userId;

  if (!userId) {
    throw Error('userId is not defined');
  }

  const organizations = await OrganizationRepository.findOrganizationsByUserId(userId);
  const response: OrganizationDTO[] = organizations.map(mapOrganizationToOrganizationDTO);
  return res.send(response);
};

export const postOrganization = async (
  req: Request<ParamsDictionary, OrganizationDTO, OrganizationCreateDTO>,
  res: Response<OrganizationDTO>
) => {
  const name = DOMPurify.sanitize(req.body.name);
  const organization = Organization.create({ name: name });
  const userId = req.userId;

  if (!userId) {
    throw Error('userId is not defined');
  }

  const user: User = await UserRepository.findUserById(userId);
  organization.users = [user];
  await AppDataSource.manager.save(organization);

  const response: OrganizationDTO = mapOrganizationToOrganizationDTO(organization);
  return res.send(response);
};

export const getOrganization = async (
  req: Request<ParamsDictionary, OrganizationDTO, {}, OrganizationGetQueryDTO>,
  res: Response
) => {
  const organizationId: string = req.params.organizationId;
  const includeProperties: boolean = !!req.query.includeProperties;

  let organization: Organization;

  if (includeProperties) {
    organization = await OrganizationRepository.findOrganizationWithPropertiesById(organizationId);
  } else {
    organization = await OrganizationRepository.findOrganizationById(organizationId);
  }

  console.log(typeof req.query.includeProperties);
  console.log(organization);

  const response: OrganizationDTO = mapOrganizationToOrganizationDTO(organization);
  res.send(response);
};
