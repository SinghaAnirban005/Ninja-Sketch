import { HTTP_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const token = localStorage.getItem("authToken") ?? "";

  const res = await axios.get(`${HTTP_URL}/chats/${roomId}`, {
    withCredentials: true,
    headers: {
      Authorization: token,
    },
  });
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}
