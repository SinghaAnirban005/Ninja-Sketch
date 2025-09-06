"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import axios from "axios";
import { HTTP_URL } from "@/config";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${authToken}`);

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
  }, []);

  useEffect(() => {
    const getShapes = async () => {
      try {
        const { data } = await axios.get(`${HTTP_URL}/api/v1/chats/${roomId}`, {
          withCredentials: true,
        });
        console.log(data);
      } catch (err) {
        console.error("Error fetching shapes:", err);
      }
    };

    getShapes();
  }, []);

  if (!socket) {
    return <div>Connecting to Server ...</div>;
  }

  return (
    <Canvas roomId={roomId} socket={socket} authToken={authToken as string} />
  );
}
