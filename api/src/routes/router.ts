import express from "express";
import { deleteThread, getThreads, postThread, updateThread } from "../controllers/threadController";
import { deleteReply, getReplies, postReply, updateReplyMessage } from "../controllers/replyController";
import { postProject, getExistingProjects } from "../controllers/projectController";
import { getCurrentUser } from "../controllers/userController";
import { authorize } from "../isAuth";
import passport from "passport";
import { postOrganization } from "../controllers/organizationController";

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

router.post("/threads", authorize, postThread);
router.get("/threads", authorize, getThreads);
router.put("/threads/:id", authorize, updateThread);
router.delete("/threads/:id", authorize, deleteThread);

router.post("/replies/", authorize, postReply);
router.get("/replies/", authorize, getReplies);
router.put("/replies/:id", authorize, updateReplyMessage);
router.delete("/replies/:id", authorize, deleteReply);

router.post("/projects", authorize, postProject);
router.get("/projects/existing", authorize, getExistingProjects);

router.post("/organizations", authorize, postOrganization);

export default router;