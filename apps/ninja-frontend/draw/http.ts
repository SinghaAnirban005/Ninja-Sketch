import { HTTP_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_URL}/chats/${roomId}`, {
    withCredentials: true,
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NWMzNDNmOS03N2EyLTQ5MTMtYWY3MC02NmY3MzkxNWJjMzgiLCJpYXQiOjE3NTU5MzE3MTd9.dsyA2ksgc4Obv1BQljAPCH_AQ8Xse995ZoGMrU6zSPk",
    },
  });
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}
