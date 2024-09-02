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
  const includeMembers: boolean = req.query.includeMembers === true;

  let organization: Organization;

  if (includeMembers) {
    organization = await OrganizationRepository.findOrganizationAndMembersById(organizationId);
  } else {
    organization = await OrganizationRepository.findOrganizationById(organizationId);
  }

  const response: OrganizationDTO = mapOrganizationToOrganizationDTO(organization);
  res.send(response);
};
