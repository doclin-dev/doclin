import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authorize: RequestHandler<{}, any, any, {}> = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).send("Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!payload.userId) {
      res.status(403).send("Unauthorized");
      return;
    }

    req.userId = payload.userId;
  } catch {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
  return;
};
