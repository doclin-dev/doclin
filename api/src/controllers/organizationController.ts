import { OrganizationRepository } from "../database/repositories/OrganizationRepository";
import { Organization } from "../database/entities/Organization";
import { UserRepository } from "../database/repositories/UserRepository";
import { AppDataSource } from "../database/dataSource";

export const getExistingOrganizations = async (req: any, res: any) => {
    const organizations = await OrganizationRepository.findOrganizationsByUserId(req.user?.id);

    const responseOrganizations = organizations.map(organization => ({
        id: organization.id,
        name: organization.name,
    }));

    return res.send({ organizations: responseOrganizations });
}

export const postOrganization = async (req:any, res:any) => {
    const name = req.body.name;

    console.log("post", name);

    const organization = Organization.create({
        name: name,
    });

    const user = await UserRepository.findUserById(req.userId);

    if (!user) {
        return res.status(403).send("Unauthorized");
    }

    user.organizations = [organization];
    await AppDataSource.manager.save(user);

    console.log(user);

    return res.send({ organization });
}