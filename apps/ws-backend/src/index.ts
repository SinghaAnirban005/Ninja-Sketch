import WebSocket, { WebSocketServer } from 'ws';
import jwt, { decode, JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config'
import { prismClient } from "@repo/db/client"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from 'url';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = []


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); 

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);

  const url = request.url
  if(!url){
    return
  }

  const queryParams = new URLSearchParams(url.split("?")[1])

  const token = queryParams.get("token") || ""
  const decoded = jwt.verify(token, JWT_SECRET)

  if(!decoded || !(decoded as JwtPayload).userId) {
    ws.close()
  }

  const userId = (decoded as JwtPayload).userId

  if(!userId){  
    ws.close()
    return;
  }

  users.push({
    ws,
    rooms: [],
    userId
  })

  ws.on('message', async function message(data) {
    // const parsedData = JSON.parse(data as unknown as string)
    let parsedData

    if(typeof data !== "string") {
      parsedData = JSON.parse(data.toString())
    }
    else{
      parsedData = JSON.parse(data)
    }
    
    if(parsedData.type === "join_room"){
      const user = users.find(x => x.ws === ws)
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws)
      if(!user){
        return
      }

      user.rooms = user.rooms.filter(room => room === parsedData.room)
    }

    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId
      const message = parsedData.message

      const IntRoomId = Number(roomId)

      await prismClient.chat.create({
        data: {
          message: message,
          userId: userId,
          roomId: IntRoomId
        }
      })

      users.forEach((user) => {
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }

  });

});