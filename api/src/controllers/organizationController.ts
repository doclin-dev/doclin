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
import { IncludePropertiesQueryDTO } from '../../../shared/types/IncludePropertiesQueryDTO';
import { ParamsDictionary } from '../types/ParamsDictionary';
import logger from '../logger';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const getOrganizations = async (
  req: Request<ParamsDictionary, OrganizationDTO[], {}>,
  res: Response<OrganizationDTO[]>
) => {
  const userId: number | undefined = req.userId;

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
  const name: string = DOMPurify.sanitize(req.body.name);
  const organization: Organization = Organization.create({ name: name });
  const userId: number | undefined = req.userId;

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
  req: Request<ParamsDictionary, OrganizationDTO, {}, IncludePropertiesQueryDTO>,
  res: Response<OrganizationDTO>
) => {
  const organizationId: string = req.params.organizationId;
  const includeProperties: boolean = !!req.query.includeProperties;
  const userId: number | undefined = req.userId;
  let organization: Organization;

  try {
    if (includeProperties) {
      organization = await getOrganizationWithProperties(organizationId, userId);
    } else {
      organization = await OrganizationRepository.findOrganizationById(organizationId);
    }

    const response: OrganizationDTO = mapOrganizationToOrganizationDTO(organization);
    res.send(response);
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};

const getOrganizationWithProperties = async (organizationId: string, userId: number | undefined) => {
  const isUserMember = userId && (await OrganizationRepository.checkUserExistsInOrganization(organizationId, userId));

  if (isUserMember) {
    return OrganizationRepository.findOrganizationWithAllProjectsById(organizationId);
  } else {
    return OrganizationRepository.findOrganizationWithPublicProjectsById(organizationId);
  }
};
