import express from "express";
import { deleteThread, getThreads, postThread, updateThread } from "../controllers/threadController";
import replyRouter from "./replyRouter";

const BASE_REPLY_ROUTE = "/:threadId/replies";

const threadRouter = express.Router({ mergeParams: true });

threadRouter.post("/", postThread);
threadRouter.get("/", getThreads);
threadRouter.put("/:id", updateThread);
threadRouter.delete("/:id", deleteThread);

threadRouter.use(BASE_REPLY_ROUTE, replyRouter);

export default threadRouter;