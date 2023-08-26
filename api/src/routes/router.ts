
const express = require("express");
const router = express.Router();
const threadController = require("../controllers/threadController");
const projectController = require("../controllers/projectController");
const userController = require("../controllers/userController");
import { isAuth } from "../isAuth";

import passport from "passport";

router.get("/auth/github", passport.authenticate("github", { session: false }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res: any) => {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
);

router.get("/me", userController.getCurrentUser);

router.get("/", (_req: any, res: any) => {
    res.send("hello");
});

router.post("/threads", isAuth, threadController.postThread);
router.get("/threads", isAuth, threadController.getThreads);
router.put("/threads/:id", isAuth, threadController.updateThreadMessage);
router.post("/threads/:id/comment", isAuth, threadController.postComment);
router.delete("/threads/delete/:id", isAuth, threadController.deleteThread);

router.get("/currentProject/", isAuth, projectController.getCurrentProject);
router.get("/existingProjects/", isAuth, projectController.getExistingProjects);
router.post("/project", isAuth, projectController.createProject);

module.exports = router;