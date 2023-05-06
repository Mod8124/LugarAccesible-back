import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    email: z
    .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
    .email(),
    name: z.string(),
};

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Requiere password",
        invalid_type_error: "La contraseña debe ser cadena"
    })
})

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userCore
})

const loginSchema = z.object({
    email: z.string({
        required_error: "Requiere email",
        invalid_type_error: "El correo debe ser cadena"
    }).email(),
    password: z.string()
})

const loginResponseSchema = z.object({
    accessToken: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginInput = z.infer<typeof loginSchema>

export const {schemas: userSchema, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
}, {$id:'User_Schemas'})