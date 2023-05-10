import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const placeCore = {
    id_google_place: z.string(),
    userId: z.number()
}

const rspCore = {
    code: z.number(),
    msn: z.string(),
    rta: z.object({
        id: z.number(),
        ...placeCore
        }
    ).optional()
}

const createPlaceSchema = z.object({
    ...placeCore
})

const responsePlaceSchema = z.object({
    status: z.boolean(),
    response: z.object({
        ...rspCore
    })
})

export type CreatePlaceSchema = z.infer<typeof createPlaceSchema>

export const {schemas: placeSchema, $ref} = buildJsonSchemas({
    createPlaceSchema,
    responsePlaceSchema
}, {$id:'Place_Schemas'})


