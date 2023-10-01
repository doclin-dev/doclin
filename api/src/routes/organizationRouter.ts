import express from "express";
import { getOrganization, getOrganizations, postOrganization } from "../controllers/organizationController";
import { verifyAuthentication, verifyOrganizationAccess } from "../middlewares/auth";
import projectRouter from "./projectRouter";

const BASE_PROJECT_ROUTE = "/:organizationId/projects";

const organizationRouter = express.Router({ mergeParams: true });

organizationRouter.get("/", verifyAuthentication, getOrganizations);
organizationRouter.post("/", verifyAuthentication, postOrganization);
organizationRouter.get("/:organizationId", verifyAuthentication, getOrganization);

organizationRouter.use(BASE_PROJECT_ROUTE, verifyOrganizationAccess, projectRouter);

export default organizationRouter;