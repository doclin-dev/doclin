import { ProjectRepository } from "../database/repositiories/ProjectRepository";
import { Project } from "../database/entities/Project";
import { CompanyRepository } from "../database/repositiories/CompanyRepository";

export const getExistingProjects = async (req: any, res: any) => {
    const githubUrl: string = req.query.githubUrl;

    const projects = await ProjectRepository.getProjectsByCompanyIdAndGitUrl(0, githubUrl);

    const responseProjects = projects.map(project => ({
        id: project.id,
        name: project.name,
        url: project.url,
        companyId: project.company?.id
    }));

    return res.send({ projects: responseProjects });
}

export const postProject = async (req:any, res:any) => {
    const name = req.body.name;
    const url = req.body.url;
    const companyId = req.body.companyId;

    const company = await CompanyRepository.getCompanyById(companyId);

    if (!company) {
        res.send({ project: null });
        return;
    }

    const project = await Project.create({
        name: name,
        url: url
    }).save();

    req.session.currentProjectId = project.id;
    req.session.save();

    return res.send({project});
}