import express from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismClient } from "@repo/db/client";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

app.post("/signup", async (req, res) => {
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

app.post("/signin", async (req, res) => {
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

app.post("/room", middleware, async (req, res) => {
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

app.get("/rooms", middleware, async (req, res) => {
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

app.get("/chats/:roomId", middleware, async (req, res) => {
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
});

app.post("/signout", middleware, (req, res) => {
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

app.listen(4000, () => {
  console.log("Server running");
  console.log(process.env.DATABASE_URL);
});
