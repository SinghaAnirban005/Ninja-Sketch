import { middleware } from "../Middlewares/middleware.js";
import { CreateRoomSchema } from "@repo/common/types";
import { prismClient } from "@repo/db/client";
import { Router } from "express";
import { Request, Response } from "express";

export const RoomRouter: Router = Router();

RoomRouter.post("/room", middleware, async (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Incorret inputs",
    });

    return;
  }
  //@ts-ignore
  const userId = req.userId;

  try {
    const room = await prismClient.room.create({
      data: {
        slug: data.data.name,
        joinId: crypto.randomUUID(),
        adminId: userId,
      },
    });

    res.status(200).json({
      roomId: room.id,
    });

    return;
  } catch (error) {
    res.status(411).json({
      message: "Failed to create Room",
    });

    return;
  }
});

RoomRouter.get("/rooms", middleware, async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = await req.userId;

  if (!userId) {
    res.status(401).json({
      message: "No user available",
    });

    return;
  }

  const rooms = await prismClient.room.findMany({
    where: {
      adminId: userId,
    },
  });

  if (!rooms) {
    res.status(401).json({
      message: "No rooms found",
    });

    return;
  }

  res.status(200).json({
    rooms: rooms,
    message: "Fetched rooms succesfully",
  });

  return;
});

RoomRouter.post(
  "/room-detail",
  middleware,
  async (req: Request, res: Response) => {
    const { id } = req.body;
    //@ts-ignore
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({
        message: "No user found",
      });

      return;
    }

    const room = await prismClient.room.findUnique({
      where: {
        id: id,
        adminId: userId,
      },
    });

    if (!room) {
      res.status(400).json({
        message: "Room does not exist",
      });

      return;
    }

    res.status(200).json({
      message: "Fetched room details",
      joinCode: room.joinId,
    });

    return;
  },
);

RoomRouter.post(
  "/room/join",
  middleware,
  async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({
        message: "No user ID",
      });

      return;
    }

    const { joinCode } = req.body;
    if (!joinCode) {
      res.status(400).json({
        message: "JOIN CODE missing",
      });

      return;
    }

    const valid = await prismClient.room.findUnique({
      where: {
        joinId: joinCode,
      },
    });

    if (!valid) {
      res.status(400).json({
        message: "Not valid code",
      });

      return;
    }

    res.status(200).json({
      message: "Valid code",
      valid: true,
      roomId: valid.id,
    });

    return;
  },
);
