
const express = require("express");
const router = express.Router();
const threadController = require("../controllers/threadController");
const projectController = require("../controllers/projectController");

import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import { isAuth } from "../isAuth";
import passport from "passport";
import jwt from "jsonwebtoken";

router.get("/auth/github", passport.authenticate("github", { session: false }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res: any) => {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
);

router.get("/todo", isAuth, async (req: any, res: any) => {
    const todos = await Todo.find({
        where: { creatorId: req.userId },
        order: { id: "DESC" },
    });

    res.send({ todos });
});

router.post("/todo", isAuth, async (req: any, res: any) => {
    const todo = await Todo.create({
        text: req.body.text,
        creatorId: req.userId,
    }).save();
    res.send({ todo });
});

router.put("/todo", isAuth, async (req: any, res: any) => {
    const todo = await Todo.findOne(req.body.id);
    if (!todo) {
        res.send({ todo: null });
        return;
    }
    if (todo.creatorId !== req.userId) {
        throw new Error("not authorized");
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.send({ todo });
});

router.get("/me", async (req: any, res: any) => {
    // Bearer 120jdklowqjed021901
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.send({ user: null });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.send({ user: null });
        return;
    }

    let userId = "";

    try {
        const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = payload.userId;
    } catch (err) {
        res.send({ user: null });
        return;
    }

    if (!userId) {
        res.send({ user: null });
        return;
    }

    const user = await User.findOne(userId);
    res.send({ user });
});

router.get("/", (_req: any, res: any) => {
    res.send("hello");
});

router.post("/threads", threadController.post);
router.get("/project/:projectId", projectController.get);
router.post("/project", projectController.post);
router.get("/threads", threadController.get);
router.post("/threads/:id/comment", threadController.postComment);

module.exports = router;