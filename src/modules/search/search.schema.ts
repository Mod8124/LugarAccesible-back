import { string, z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const query = z.object({
  lat: z.string(),
  lng: z.string(),
  query: z.string(),
  types: z.string(),
});

const ResponseSuccess = z.object({
    status:z.string(),
    data: z.array(z.object({
    business_status: z.string(),
    formatted_address: z.string(),
    name: z.string(),
    place_id: z.string(),
   types: z.array(z.string()),
   location: z.object({
      lat: z.number(),
      lng: z.number()
   }),
    opening_hours: z.object({
      open_now: z.boolean()
    }),
    wheelchair_accessible_entrance: z.boolean()
    }))
});

const ResponseFailed = z.object({
      status: z.string(),
      message: z.string(),
})

export const {schemas: searchSchema, $ref } = buildJsonSchemas({
    query,
    ResponseSuccess,
    ResponseFailed
}, {$id:'Search_Schemas'})