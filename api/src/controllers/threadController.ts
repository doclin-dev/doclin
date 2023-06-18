import { Thread } from "../entities/Thread";

export const post = async (req: any, res: any) => {
    const thread = await Thread.create({
        message: req.body.message,
        userId: req.userId,
    }).save();

    res.send({ thread });
}