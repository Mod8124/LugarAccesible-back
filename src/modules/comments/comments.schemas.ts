import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const coreComments = {
    userId: z.number(),
    id_place: z.number(),
    text: z.string().optional(),
    id_respuesta: z.number().optional()
}

const rspCore = {
    code: z.number(),
    msn: z.string(),
    rta: z.object({
        id: z.number(),
        ...coreComments
        }
    ).optional()
}

const createComments = z.object({    
    ...coreComments
})

const updateComments = z.object({
    id: z.number(),
    text: z.string().optional(),
    id_respuesta: z.number().optional()
})

const responseCommentSchema = z.object({
    status: z.boolean(),
    response: z.object({
        ...rspCore
    })
})

export type CreateComments = z.infer<typeof createComments>
export type UpdateComments = z.infer<typeof updateComments>

export const {schemas: CommentSchema, $ref} = buildJsonSchemas({
    createComments,
    updateComments,
    responseCommentSchema
}, {$id:'Comment_Schema'})