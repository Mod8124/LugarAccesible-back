import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const responseOkGetFavorites = z.object({
  status: z.string(),
  msg: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      place_id: z.string(),
      name: z.string(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
  ),
});

const responseFailedGetFavorites = z.object({
  status: z.string(),
  msg: z.string(),
});

const bodyPostFavorite = z.object({
  place_id: z.string(),
  name: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const paramsDeleteFavorite = z.object({
  place_id: z.string(),
});

export const { schemas: favoriteSchema, $ref } = buildJsonSchemas(
  {
    responseOkGetFavorites,
    responseFailedGetFavorites,
    bodyPostFavorite,
    paramsDeleteFavorite,
  },
  { $id: 'Favorite_Schemas' },
);
