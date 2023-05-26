import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const body = z.object({
  name: z.string(),
  email: z.string(),
  overallSatisfaction: z.number(),
  subject: z.string(),
  msg: z.string(),
});

const responseOk = z.object({
  status: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    overallSatisfaction: z.string(),
    subject: z.string(),
    msg: z.string(),
    _id: z.string(),
    __v: z.number(),
  }),
});

const responseFailed = z.object({
  status: z.string(),
  message: z.string(),
});

export const { schemas: feedbackSchema, $ref } = buildJsonSchemas(
  {
    body,
    responseOk,
    responseFailed,
  },
  { $id: 'Feedback_Schemas' },
);
