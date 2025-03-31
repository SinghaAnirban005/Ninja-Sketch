import axios from "axios";
import { HTTP_URL } from "@/config";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}

export default async function initDraw(canvas: HTMLCanvasElement, socket: WebSocket, roomId: any) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // clearCanvas(ctx, canvas, existingShapes)
      if(message.type === "chat") {
        const parsedShape = JSON.parse(message.message)
        existingShapes.push(parsedShape.shape)
        clearCanvas(ctx, canvas, existingShapes)
      }
    }

    let existingShapes: Shape[] = await getExistingShapes(roomId)
    let startX = 0;
    let startY = 0;
    let clicked = false

    clearCanvas(ctx, canvas, existingShapes)

    canvas.addEventListener("mousedown", (e) => {
      clicked = true
      startX = e.clientX
      startY = e.clientY
    })

    canvas.addEventListener("mouseup",  (e) => {
      clicked = false
      const width = e.clientX - startX
      const height = e.clientY - startY

      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: width,
        height: height
      }
      existingShapes.push(shape)

      socket.send(JSON.stringify(
        {
          type: "chat",
          message: JSON.stringify({shape}),
          roomId: roomId
        }
      ))

      // clearCanvas(ctx, canvas, existingShapes)

    })

    canvas.addEventListener("mousemove", (e) => {
      if(clicked) { 
        const width = e.clientX - startX
        const height = e.clientY - startY
        clearCanvas(ctx, canvas, existingShapes)
        ctx.strokeStyle = "rgba(255, 255, 255)"
        ctx.strokeRect(startX, startY, width, height)
      }
    })
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle=  "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    console.log(existingShapes)
    existingShapes.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    })
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_URL}/chats/${roomId}`, {
    withCredentials: true,
    headers: {
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjY2Y5ZGNjNC1lMDQ0LTQ1YzAtOWM5Zi0xY2U0NTkxMGQwZDYiLCJpYXQiOjE3NDM0Mzc5OTZ9.4nm94SxacNFnuk_09t9iSotMQZ6iAaQNES1w8QLd0HQ"
    }
  });
  const messages = res.data.messages;

  const shapes = messages.map((x: {message: string}) => {
      const messageData = JSON.parse(x.message)
      return messageData.shape;
  })

  return shapes;
}