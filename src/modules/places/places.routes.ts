import { type FastifyInstance } from 'fastify';
import {
  getDetailHandler,
  getPlacesHandler,
  getPlacesMock,
  getDetailMock,
} from './places.controller';
import { $placeRef } from './places.schemas';

export async function PlaceRoutes(app: FastifyInstance) {
  app.get(
    '/list',
    {
      schema: {
        summary: 'Get 20 places near to the location',
        tags: ['Place'],
        querystring: $placeRef('locationSchema'),
        response: {
          200: $placeRef('responseSuccessPlacesList'),
        },
      },
    },
    getPlacesHandler,
  );

  app.get(
    '/list/mock',
    {
      schema: {
        tags: ['Place'],
        summary: 'Get 20 mock places',
        querystring: $placeRef('locationSchema'),
      },
    },
    getPlacesMock,
  );

  app.get(
    '/detail',
    {
      preHandler: [app.hasToken],
      schema: {
        tags: ['Place'],
        querystring: $placeRef('queryDetail'),
        summary: 'Get details of place by place_id',
        response: {
          200: $placeRef('responseSuccessDetail'),
          404: {
            description: 'Missing fill place_id',
            types: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'failed',
              },
              error: {
                type: 'string',
                example: 'place_id is required',
              },
            },
          },
        },
      },
    },
    getDetailHandler,
  );

  app.get(
    '/detail/mock',
    {
      schema: {
        tags: ['Place'],
        summary: 'Generate a detail mock up place',
      },
    },
    getDetailMock,
  );
}

export default PlaceRoutes;
