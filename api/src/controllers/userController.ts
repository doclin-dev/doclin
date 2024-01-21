import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserRepository } from "../database/repositories/UserRepository";
import { ACCESS_TOKEN_SECRET } from "../envConstants";

export const getCurrentUser = async (req: Request, res: Response) => {
	const authHeader = req.headers.authorization;
	const userId = getUserIdFromAuthHeader(authHeader);

    if (userId == null) {
        res.send({ user: null});
        return;
    }
    
    const user = await UserRepository.findUserById(userId);

    res.send({ user });
}

export const getUserIdFromAuthHeader = (authHeader: string | undefined) => {
	if (!authHeader) {
		return null;
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return null;
	}

	try {
		const payload: any = jwt.verify(token, ACCESS_TOKEN_SECRET);

    	if (!payload.userId) {
      		return null;
    	}

		return payload.userId;
	} catch {
		return null;
	}
}