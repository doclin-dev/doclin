import express from "express";
import { postProject, getProjects } from "../controllers/projectController";
import threadRouter from "./threadRouter";

const projectRouter = express.Router({ mergeParams: true });

const BASE_THREAD_ROUTE = "/:projectId/threads";

projectRouter.post("/", postProject);
projectRouter.get("/", getProjects);

projectRouter.use(BASE_THREAD_ROUTE, threadRouter);

export default projectRouter;