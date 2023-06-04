import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const responseSuccessPlacesList = z.array(
  z.object({
    place_id: z.string(),
    name: z.string(),
    types: z.array(z.string()),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    wheelchair_accessible_entrance: z.boolean(),
  }),
);

const queryDetail = z.object({
  place_id: z.string(),
});

const responseSuccessDetail = z.object({
  status: z.string().optional(),
  data: z.array(
    z.object({
      formatted_address: z.string().optional(),
      formatted_phone_number: z.string().optional(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      name: z.string().optional(),
      international_phone_number: z.string().optional(),
      opening_hours: z
        .object({
          open_now: z.boolean().optional(),
          periods: z.array(
            z.object({
              close: z
                .object({
                  day: z.number(),
                  time: z.string(),
                })
                .optional(),
              open: z
                .object({
                  day: z.number(),
                  time: z.string(),
                })
                .optional(),
            }),
          ),
          weekday_text: z.array(z.string().optional()),
        })
        .optional(),
      photos: z
        .array(
          z
            .object({
              height: z.number(),
              html_attributions: z.array(z.string()),
              photo_reference: z.string(),
              width: z.number(),
            })
            .optional(),
        )
        .optional(),
      place_id: z.string().optional(),
      website: z.string().optional(),
      types: z.array(z.string().optional()).optional(),
      wheelchair_accessible_entrance: z.boolean().optional(),
      isFavorite: z.boolean().optional(),
    }),
  ),
});

export const { schemas: placeSchema, $ref: $placeRef } = buildJsonSchemas(
  {
    responseSuccessPlacesList,
    locationSchema,
    queryDetail,
    responseSuccessDetail,
  },
  { $id: 'Place_Schemas' },
);
