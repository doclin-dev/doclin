import { User } from "../database/entities/User";
import jwt from "jsonwebtoken";

export const getCurrentUser = async (req: any, res: any) => {
    const authHeader = req.headers.authorization;
    let user = null;

    if (!authHeader) {
        res.send({ user });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.send({ user });
        return;
    }

    let userId;

    try {
        const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = payload.userId;
    } catch (err) {
        res.send({ user });
        return;
    }

    if (!userId) {
        res.send({ user });
        return;
    }

    try {
        user = await User.findOneBy({ id: userId });
    } catch(err) {
        res.send({ user });
        return;
    }

    res.send({ user });
}