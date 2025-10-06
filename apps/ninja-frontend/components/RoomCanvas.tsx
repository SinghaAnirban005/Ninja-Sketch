"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

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

    return () => {
      if(ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "leave_room"
        }))
      }
    }
  }, []);

  if (!socket) {
    return <div>Connecting to Server ...</div>;
  }

  return (
    <Canvas roomId={roomId} socket={socket} authToken={authToken as string} />
  );
}
