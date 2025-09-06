import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";

export const middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({
      message: "NO auth header found",
    });

    return;
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;

  if (decoded) {
    //@ts-ignore
    req.userId = (decoded as JwtPayload).userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized user",
    });
  }
};
