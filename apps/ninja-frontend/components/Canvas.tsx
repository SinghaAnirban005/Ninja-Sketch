import initDraw from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({roomId, socket}: {
    roomId: string,
    socket: WebSocket
}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas == null) {
        return
        }
        initDraw(canvas, socket, roomId)

    }, [canvasRef]);

    return (
        <div>
        <canvas ref={canvasRef} width={2000} height={1000} />
        </div>
    );
}