import express from "express";
import passport from "passport";
import { getCurrentUser } from "../controllers/userController";
import { verifyAuthentication } from "../middlewares/auth";
import { githubCallback } from "../controllers/githubAuthController";
import organizationRouter from "./organizationRouter";
import { redeemInvitation } from "../controllers/invitationController";
import { log } from "../controllers/loggerController";

const BASE_ORGANIZATION_ROUTE = "/organizations";

const router = express.Router();

router.get("/", (_req, res) => res.send("doclin-api"));
router.get("/auth/github", passport.authenticate("github", { session: false }));
router.get("/auth/github/callback", passport.authenticate("github", { session: false }), githubCallback);
router.get("/auth/user", getCurrentUser);
router.post("/redeemInvitation", verifyAuthentication, redeemInvitation);
router.post("/log", log);

router.use(BASE_ORGANIZATION_ROUTE, verifyAuthentication, organizationRouter);

export default router;