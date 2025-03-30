import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().min(6),
    password: z.string(),
    name: z.string().min(6).max(16)
})

export const SigninSchema = z.object({
    name: z.string().min(6),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string().min(6).max(16),
})