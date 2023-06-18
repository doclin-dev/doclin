import { Project } from "../entities/Project";

export const get = async (req:any, res: any) => {
    const projectId = req.params.projectId;
    const project = await Project.findOne(projectId);
    if (!project) {
        res.send({ proejct : null });
        return;
    }

    return res.send(project);
};

export const post = async (req:any, res:any) => {
    const project = await Project.create({
        name: req.body.name,
        url: req.body.url,
        userId: req.userId,
    }).save();

    res.send({project});
}