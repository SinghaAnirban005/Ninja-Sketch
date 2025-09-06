import express, { Express } from "express";
import { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { AuthHandler } from "./Handlers/Auth.js";
import { ChatRouter } from "./Handlers/Chats.js";
import { RoomRouter } from "./Handlers/Room.js";

export const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://ninja-sketch-8vy9.onrender.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const router = Router();

router.use("/api/v1", AuthHandler);
router.use("/api/v1", ChatRouter);
router.use("/api/v1", RoomRouter);

app.use(router);

app.listen(4000, () => {
  console.log("Server running");
  console.log(process.env.DATABASE_URL);
});
