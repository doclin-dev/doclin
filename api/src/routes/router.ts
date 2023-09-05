import express from "express";
import { deleteThread, getThreads, postThread, updateThreadMessage } from "../controllers/threadController";
import { deleteReply, getReplies, postReply, updateReplyMessage } from "../controllers/replyController";
import { createProject, getExistingProjects } from "../controllers/projectController";
import { getCurrentUser } from "../controllers/userController";
import { isAuth } from "../isAuth";
import passport from "passport";

const router = express.Router();

router.get("/auth/github", passport.authenticate("github", { session: false }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res: any) => {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
);

router.get("/auth/user", getCurrentUser);

router.post("/threads", isAuth, postThread);
router.get("/threads", isAuth, getThreads);
router.put("/threads/:id", isAuth, updateThreadMessage);
router.delete("/threads/:id", isAuth, deleteThread);

router.post("/replies/:threadId", isAuth, postReply);
router.get("/replies/:threadId", isAuth, getReplies);
router.put("/replies/:id", isAuth, updateReplyMessage);
router.delete("/replies/delete/:id", isAuth, deleteReply);

router.post("/projects", isAuth, createProject);
router.get("/projects/existing", isAuth, getExistingProjects);

export default router;