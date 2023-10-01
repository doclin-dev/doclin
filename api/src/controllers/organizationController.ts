import { OrganizationRepository } from "../database/repositories/OrganizationRepository";
import { Organization } from "../database/entities/Organization";
import { UserRepository } from "../database/repositories/UserRepository";
import { AppDataSource } from "../database/dataSource";
import { Request, Response } from "express";

export const getOrganizations = async (req: any, res: any) => {
    const organizations = await OrganizationRepository.findOrganizationsByUserId(req.userId);

    const responseOrganizations = organizations.map(organization => ({
        id: organization.id,
        name: organization.name,
    }));

    return res.send({ organizations: responseOrganizations });
}

export const postOrganization = async (req:any, res:any) => {
    const name = req.body.name;

    const organization = Organization.create({
        name: name,
    });

    const user = await UserRepository.findUserById(req.userId);

    if (!user) {
        throw new Error('User does not exist');
    }

    organization.users = [user];
    await AppDataSource.manager.save(organization);

    return res.send({ organization });
}

export const getOrganization = async (req: Request, res: Response) => {
    const organizationId: string = req.params.organizationId;

    const organization = await OrganizationRepository.findOrganizationById(organizationId);

    if (!organization) {
        res.send({ organization: null });
        return;
    }

    const responseOrganization = {
        id: organization.id,
        name: organization.name
    };

    res.send({ organization: responseOrganization });
}