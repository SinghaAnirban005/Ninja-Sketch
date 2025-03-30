import express from "express"
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js"
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types"
import { prismClient } from "@repo/db/client"
 
const app = express()
app.use(express.json())
// const JWT_SECRET = "fjdsnfkjdbljb"

app.post('/signup', async(req, res) => {
    const data = CreateUserSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }

    try {
        const user = await prismClient.user.create({
            data: {
                email: data.data.email,
                password: data.data.password,
                name: data.data.name
            }
        })
    
        res.status(200).json({
            userId: user.id
        })

        return
    } catch (error) {
        res.status(411).json({
            message: "User already exists"
        })

        return
    }
})

app.post('/signin', async(req, res) => {

    const data = SigninSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }

    const registeredUser = await prismClient.user.findFirst({
        where: {
            email: data.data.name,
            password: data.data.password
        }
    })
    const token = jwt.sign({
        userId: registeredUser?.id, 
    },
    JWT_SECRET)

    res.json({
        token: token
    })
})

app.post('/room', middleware, async(req, res) => {
    const data = CreateRoomSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }
    //@ts-ignore
    const userId = req.userId

    try {
        const room = await prismClient.room.create({
            data: {
                slug: data.data.name,
                adminId: userId,
            }
        })

        res.status(200).json({
            roomId: room.id
        })

        return
    } catch (error) {
        res.status(411).json({
            message: "Failed to create Room"
        })


        return;
    }
})

app.listen(3000)