import { HTTP_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
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