import { type FastifyInstance } from 'fastify';
import {
  getFavoritesByUserId,
  postFavoriteByPlaceId,
  deleteFavoriteByPlaceId,
} from './favorites.controller';
import { $ref } from './favorites.schema';

export async function FavoritesRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Favorite'],
        summary: 'get all favorites places by user',
        response: {
          200: $ref('responseOkGetFavorites'),
        },
      },
    },
    getFavoritesByUserId,
  );

  app.post(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Favorite'],
        summary: 'Post a favorite by place_id',
        body: $ref('bodyPostFavorite'),
        response: {
          200: $ref('responseOkGetFavorites'),
          400: $ref('responseFailedGetFavorites'),
        },
      },
    },
    postFavoriteByPlaceId,
  );

  app.delete(
    '/:place_id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Favorite'],
        summary: 'delete a favorite place by Place_id',
        params: $ref('paramsDeleteFavorite'),
        response: {
          200: $ref('responseOkGetFavorites'),
          400: $ref('responseFailedGetFavorites'),
        },
      },
    },
    deleteFavoriteByPlaceId,
  );
}
