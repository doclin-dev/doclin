import express from "express";
import { postProject, getProjects, getProject } from "../controllers/projectController";
import threadRouter from "./threadRouter";
import { sendInvitation } from "../controllers/invitationController";

const projectRouter = express.Router({ mergeParams: true });

const BASE_THREAD_ROUTE = "/:projectId/threads";

projectRouter.post("/", postProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:projectId", getProject);
projectRouter.post("/:projectId/invite", sendInvitation);

projectRouter.use(BASE_THREAD_ROUTE, threadRouter);

export default projectRouter;