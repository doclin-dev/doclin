import { Project } from "../entities/Project";

export const getRelevantProjects = async (req: any, res: any) => {
    console.log(req.user);
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