import { type FastifyInstance } from 'fastify';
import {
  getCommentByPlaceId,
  postCommentByPlaceID,
  editCommentByPlaceId,
  deleteCommentByPlace_id,
} from './comments.controller';
import { $ref } from './comments.schemas';

export async function commentRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [app.hasToken],
      schema: {
        tags: ['Comment'],
        querystring: $ref('queryGetComment'),
        summary:
          'Get comment & rating by place_id, the property owner by default is false only the user is owner is true',
        response: {
          200: $ref('responseOkGetComment'),
          400: $ref('responseFailedGetComments'),
        },
      },
    },
    getCommentByPlaceId,
  );

  app.post(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Comment'],
        summary: 'Post a comment by place_id',
        body: $ref('bodyPostComment'),
        response: {
          200: $ref('responseOkGetComment'),
          400: $ref('responseFailedGetComments'),
        },
      },
    },
    postCommentByPlaceID,
  );

  app.post(
    '/edit',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Comment'],
        summary: 'edit a comment by place_id and id comment',
        body: $ref('bodyEditPostComment'),
        response: {
          200: $ref('responseOkGetComment'),
          400: $ref('responseFailedGetComments'),
        },
      },
    },
    editCommentByPlaceId,
  );

  app.delete(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Comment'],
        summary: 'Delete a comment by place_id and id comment',
        body: $ref('bodyDeleteComment'),
        response: {
          200: $ref('responseOkGetComment'),
          400: $ref('responseFailedGetComments'),
        },
      },
    },
    deleteCommentByPlace_id,
  );
}
