import express from "express";
import { postProject, getProjects, getProject } from "../controllers/projectController";
import threadRouter from "./threadRouter";
import { sendInvitation } from "../controllers/invitationController";
import copilotRouter from "./copilotRouter";

const projectRouter = express.Router({ mergeParams: true });

const BASE_THREAD_ROUTE = "/:projectId/threads";
const BASE_COPILOT_ROUTE = "/:projectId/copilot";

projectRouter.post("/", postProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:projectId", getProject);
projectRouter.post("/:projectId/invite", sendInvitation);

projectRouter.use(BASE_THREAD_ROUTE, threadRouter);
projectRouter.use(BASE_COPILOT_ROUTE, copilotRouter);

export default projectRouter;