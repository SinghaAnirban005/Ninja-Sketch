import { middleware } from "../Middlewares/middleware.js";
import { prismClient } from "@repo/db/client";
import { Router } from "express";
import { Request, Response } from "express";

export const ChatRouter: Router = Router();

ChatRouter.get(
  "/chats/:roomId",
  middleware,
  async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);
    //@ts-ignore
    const userId = req.userId;

    if (!userId) {
      console.error("NO user exits");
      return;
    }

    const msgs = await prismClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.status(200).json({
      messages: msgs,
    });
  },
);

ChatRouter.delete(
  "/chats/:roomId",
  middleware,
  async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;

    const roomId = Number(req.params.roomId);

    if (!userId) {
      res.status(401).json({
        message: "User does not exist",
      });
      return;
    }

    const room = await prismClient.room.findFirst({
      where: {
        id: roomId,
        adminId: userId,
      },
    });

    if (!room) {
      res
        .status(403)
        .json({ message: "Not authorized to delete chats in this room" });
      return;
    }

    await prismClient.chat.deleteMany({
      where: {
        roomId: roomId,
      },
    });

    res.status(200).json({ message: "All chats deleted successfully." });
    return;
  },
);
