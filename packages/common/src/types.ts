import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(6).max(16),
    password: z.string()
})

export const SigninSchema = z.object({
    username: z.string().min(6).max(16),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string().min(6).max(16),
})