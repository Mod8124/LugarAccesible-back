import { TypeOf, z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const locationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
})

const setId = {
    id: z.number()
}

const setRtng = {
    rating: z.number().optional()
}

const idPlaceSchema = z.object(setId)

const placeCore = {
    id_google_place: z.string()
}

const updateAvg = {
    ...setId
}

const rspCore = {
    code: z.number(),
    msn: z.string(),
    rta: z.object({
        ...setId,
        ...placeCore,
        ...setRtng
        }
    ).optional()
}

const searchPlaceSchema = z.object({
    ...setId
})

const createPlaceSchema = z.object({
    ...placeCore
})

const updatePlaceAvgSchema = z.object({
    ...setRtng
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
export type idPlaceSchema = z.infer<typeof idPlaceSchema>
export type UpdatePlaceAvgSchema = z.infer<typeof updatePlaceAvgSchema>
export type SearchPlaceSchema = z.infer<typeof searchPlaceSchema>

export const {schemas: placeSchema, $ref:$placeRef} = buildJsonSchemas({
    createPlaceSchema,
    idPlaceSchema,
    updatePlaceAvgSchema,
    searchPlaceSchema,
    responsePlaceSchema,
    responseSuccessPlacesList,
    locationSchema
}, {$id:'Place_Schemas'})