import { type FastifyInstance } from 'fastify';
import { postFeedback, errorHandler } from './feedback.controller';
import { $ref } from './feedback.schema';

export async function FeedbackRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        tags: ['Feedback'],
        body: $ref('body'),
        summary: 'Post a users feedback',
        response: {
          200: $ref('responseOk'),
          400: $ref('responseFailed'),
          404: {
            description: 'All files are required',
            types: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'failed',
              },
              error: {
                type: 'string',
                example: 'all files are required',
              },
            },
          },
        },
      },
    },
    postFeedback,
  );
  app.setErrorHandler(errorHandler);
}
