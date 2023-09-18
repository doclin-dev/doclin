import { ProjectRepository } from "../database/repositories/ProjectRepository";
import { Project } from "../database/entities/Project";
import { OrganizationRepository } from "../database/repositories/OrganizationRepository";

export const getExistingProjects = async (req: any, res: any) => {
    const githubUrl: string = req.query.githubUrl;

    const projects = await ProjectRepository.findProjectsByCompanyIdAndGitUrl(0, githubUrl);

    const responseProjects = projects.map(project => ({
        id: project.id,
        name: project.name,
        url: project.url,
        organizationId: project.organization?.id
    }));

    return res.send({ projects: responseProjects });
}

export const postProject = async (req:any, res:any) => {
    const name = req.body.name;
    const url = req.body.url;
    const organizationId = req.body.organizationId;

    const organization = await OrganizationRepository.findOrganizationById(organizationId);

    if (!organization) {
        res.send({ project: null });
        return;
    }

    const project = await Project.create({
        name: name,
        url: url
    }).save();

    return res.send({project});
}