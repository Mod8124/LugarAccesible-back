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
      lat: z.string(),
      lng: z.string(),
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
      geometry: z
        .object({
          location: z.object({
            lat: z.number(),
            lng: z.number(),
          }),
          viewport: z.object({
            northeast: z.object({
              lat: z.number(),
              lng: z.number(),
            }),
            southwest: z.object({
              lat: z.number(),
              lng: z.number(),
            }),
          }),
        })
        .optional(),
      name: z.string().optional(),
      international_phone_number: z.string().optional(),
      opening_hours: z
        .object({
          open_now: z.boolean().optional(),
          periods: z.array(
            z.object({
              close: z.object({
                day: z.number(),
                time: z.string(),
              }),
              open: z.object({
                day: z.number(),
                time: z.string(),
              }),
            }),
          ),
          weekday_text: z.array(z.string()),
        })
        .optional(),
      photos: z
        .array(
          z.object({
            height: z.number(),
            html_attributions: z.array(z.string()),
            photo_reference: z.string(),
            width: z.number(),
          }),
        )
        .optional(),
      place_id: z.string().optional(),
      rating: z.number().optional(),
      reviews: z
        .array(
          z.object({
            author_name: z.string(),
            author_url: z.string(),
            language: z.string(),
            original_language: z.string(),
            profile_photo_url: z.string(),
            rating: z.number(),
            relative_time_description: z.string(),
            text: z.string(),
            time: z.number(),
            translated: z.boolean(),
          }),
        )
        .optional(),
      user_ratings_total: z.number().optional(),
      website: z.string().optional(),
      types: z.array(z.string()).optional(),
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
