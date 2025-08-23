"use client";
import initDraw from "@/draw";
import { useRef, useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import axios from "axios";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NWMzNDNmOS03N2EyLTQ5MTMtYWY3MC02NmY3MzkxNWJjMzgiLCJpYXQiOjE3NTU5MzE3MTd9.dsyA2ksgc4Obv1BQljAPCH_AQ8Xse995ZoGMrU6zSPk`,
    );

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
        const { data } = await axios.get(
          `http://localhost:4000/chats/${roomId}`,
          {
            withCredentials: true,
          },
        );
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

  return <Canvas roomId={roomId} socket={socket} />;
}
