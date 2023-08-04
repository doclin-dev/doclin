import { Project } from "../entities/Project";

export const getExistingProjects = async (req: any, res: any) => {
    let projects = await Project.find({
        where: {
            userId: req.userId
        }
    });

    return res.send(projects);
}

export const getCurrentProject = async (req:any, res: any) => {
    const currentProjectId = req.session.currentProjectId; // Get session variable
    console.log('Session variable value: ' + currentProjectId);

    let project;
    
    if (currentProjectId) {
        project = await Project.findOne(currentProjectId);
    }
    
    if (!project) {
        res.send({ project : null });
        return;
    }

    return res.send(project);
};

export const createProject = async (req:any, res:any) => {
    const project = await Project.create({
        name: req.body.name,
        url: req.body.url,
        userId: req.userId,
    }).save();

    res.send({project});
}