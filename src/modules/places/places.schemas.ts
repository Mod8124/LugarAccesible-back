import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const locationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
 })

const placeCore = {
    id_google_place: z.string(),
    userId: z.number(),
    raiting: z.number()
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

const responseSuccessPlacesList = z.array(z.object({
    place_id: z.string(),
    name: z.string(),
    types: z.array(z.string()),
    location: z.object({
                lat: z.string(),
                lng: z.string()
    }),
    wheelchair_accessible_entrance: z.boolean(),
}))

export type CreatePlaceSchema = z.infer<typeof createPlaceSchema>

export const {schemas: placeSchema, $ref:$placeRef} = buildJsonSchemas({
    createPlaceSchema,
    responsePlaceSchema,
    locationSchema,
    responseSuccessPlacesList
}, {$id:'Place_Schemas'})
