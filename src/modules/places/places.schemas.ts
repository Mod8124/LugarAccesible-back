import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";


const locationSchema = z.object({
   lat: z.number(),
   lng: z.number(),
})

export const {schemas: placeSchema, $ref: $placeRef} = buildJsonSchemas({
   locationSchema
}, {$id: 'Place_Schema'})