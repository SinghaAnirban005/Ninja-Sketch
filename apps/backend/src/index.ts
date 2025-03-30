import express from "express"
import { JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware"
import {CreateUserSchema} from "@repo/common/types"

const app = express()

app.post('/signup', async(req, res) => {
    const data = CreateUserSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }

})

app.post('/signin', (req, res) => {

    const data = CreateUserSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }


    const userId = 1;
    const token = jwt.sign({
        userId, 
    },
    JWT_SECRET)

    res.json({
        token: token
    })
})

app.post('/room', middleware, (req, res) => {
    const data = CreateUserSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message: "Incorret inputs"
        })

        return
    }
})

app.listen(3000)