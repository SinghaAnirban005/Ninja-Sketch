import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "../Middlewares/middleware.js";
import { Router } from "express";
import { Request, Response } from "express";

export const AuthHandler: Router = Router();

AuthHandler.post("/signup", async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorret inputs",
    });

    return;
  }

  try {
    const user = await prismClient.user.create({
      data: {
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
      },
    });

    res.status(200).json({
      userId: user.id,
    });

    return;
  } catch (error) {
    res.status(411).json({
      message: "User already exists",
    });

    return;
  }
});

AuthHandler.post("/signin", async (req: Request, res: Response) => {
  const data = SigninSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Incorret inputs",
    });

    return;
  }

  const registeredUser = await prismClient.user.findFirst({
    where: {
      email: data.data.email,
      password: data.data.password,
    },
  });

  if(!registeredUser){
    res.status(400).json({
      message: "No User exits"
    })

    return
  }

  const token = jwt.sign(
    {
      userId: registeredUser?.id,
    },
    JWT_SECRET,
  );

  res.json({
    token: token,
    message: "User logged in successfully",
  });
});

AuthHandler.post("/signout", middleware, (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      message: "User ID does not exist",
    });
    return;
  }

  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({
      message: "Token does not exist",
    });

    return;
  }

  res.status(200).json({
    message: "User logged out",
  });
});
