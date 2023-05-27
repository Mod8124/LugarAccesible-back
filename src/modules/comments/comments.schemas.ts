import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const queryGetComment = z.object({
  place_id: z.string(),
});

const responseOkGetComment = z.object({
  status: z.string(),
  msg: z.string(),
  data: z
    .object({
      rating: z.number(),
      comments: z.array(
        z.object({
          user_id: z.string(),
          author: z.string(),
          rating: z.number(),
          text: z.string(),
          _id: z.string(),
          owner: z.boolean(),
        }),
      ),
    })
    .optional(),
});

const responseFailedGetComments = z.object({
  status: z.string(),
  msg: z.string(),
});

// post

const bodyPostComment = z.object({
  place_id: z.string(),
  author: z.string(),
  rating: z.number(),
  text: z.string(),
});

const bodyEditPostComment = z.object({
  place_id: z.string(),
  author: z.string(),
  rating: z.number(),
  text: z.string(),
  id: z.string(),
});

const bodyDeleteComment = z.object({
  place_id: z.string(),
  id: z.string(),
});

export const { schemas: commentSchema, $ref } = buildJsonSchemas(
  {
    queryGetComment,
    responseOkGetComment,
    responseFailedGetComments,
    bodyPostComment,
    bodyEditPostComment,
    bodyDeleteComment,
  },
  { $id: 'Comment_Schemas' },
);
