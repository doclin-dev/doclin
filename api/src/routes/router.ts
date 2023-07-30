
const express = require("express");
const router = express.Router();
const threadController = require("../controllers/threadController");
const projectController = require("../controllers/projectController");
const userController = require("../controllers/userController");

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

router.post("/threads", threadController.post);
router.get("/threads", threadController.get);
router.post("/threads/:id/comment", threadController.postComment);

router.get("/currentProject/", projectController.getCurrentProject);
router.post("/project", projectController.createProject);

module.exports = router;