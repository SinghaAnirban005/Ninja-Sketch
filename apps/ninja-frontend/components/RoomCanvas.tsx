"use client"
import initDraw from "@/draw";
import { useRef, useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas ({roomId}: {
    roomId: string
}) {

    const [socket , setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjY2Y5ZGNjNC1lMDQ0LTQ1YzAtOWM5Zi0xY2U0NTkxMGQwZDYiLCJpYXQiOjE3NDM0Mzc5OTZ9.4nm94SxacNFnuk_09t9iSotMQZ6iAaQNES1w8QLd0HQ`)

        ws.onopen = () => {
            setSocket(ws)

            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    }, [])

    if(!socket) {
        return <div>
            Connecting to Server ...
        </div>
    }

    return <Canvas roomId={roomId} socket={socket} />
}