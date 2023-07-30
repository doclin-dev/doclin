import { User } from "../entities/User";
import jwt from "jsonwebtoken";

export const getCurrentUser = async (req: any, res: any) => {
    // Bearer 120jdklowqjed021901
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.send({ user: null });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.send({ user: null });
        return;
    }

    let userId = "";

    try {
        const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = payload.userId;
    } catch (err) {
        res.send({ user: null });
        return;
    }

    if (!userId) {
        res.send({ user: null });
        return;
    }

    const user = await User.findOne(userId);
    res.send({ user });
}