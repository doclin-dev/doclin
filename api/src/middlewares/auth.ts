import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../database/repositories/UserRepository";
import { OrganizationRepository } from "../database/repositories/OrganizationRepository";
import { getUserIdFromAuthHeader } from "../controllers/userController";

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const userId = getUserIdFromAuthHeader(authHeader);
	
	if (!userId) {
		res.status(403).send("Unauthorized");
		return;
	}

	const user = await UserRepository.findUserById(userId);

	if (!user) {
		res.status(403).send("Unauthorized");
		return;
	}

	req.userId = userId;
	next();
};

export const verifyOrganizationAccess = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const organizationId: string = req.params.organizationId;
	const userId = getUserIdFromAuthHeader(authHeader);

	const userExists = await OrganizationRepository.checkUserExistsInOrganization(organizationId, userId);

	if (!userExists) {
		res.status(403).send("Unauthorized");
		return;
	}

	next();
};