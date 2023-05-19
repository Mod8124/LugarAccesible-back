import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { editComment } from "./comments.service";

const idComens = z.object({
    id: z.number()
})

const corEditComment = {
    text: z.string().optional(),
    raiting_comment: z.number().optional(),
    id_commet_response: z.number().optional()
}

const coreComments = {
    userId: z.number(),
    id_place: z.number(),
    ...corEditComment
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
    ...coreComments
})

const responseCommentSchema = z.object({
    status: z.boolean(),
    response: z.object({
        ...rspCore
    })
})

const reviewComment = z.object({
    ...corEditComment
})

const searchComment = z.object({
    userId: z.number(),
    id_place: z.number()
})

export type CreateComments = z.infer<typeof createComments>
export type UpdateComments = z.infer<typeof updateComments>
export type SearchComment = z.infer<typeof searchComment>
export type IdComens = z.infer<typeof idComens>
export type ReviewComment = z.infer<typeof reviewComment>

export const {schemas: CommentSchema, $ref} = buildJsonSchemas({
    createComments,
    updateComments,
    searchComment,
    idComens,
    reviewComment,
    responseCommentSchema
}, {$id:'Comment_Schema'})