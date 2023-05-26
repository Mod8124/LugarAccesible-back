import { FastifyReply, FastifyRequest } from 'fastify';
import { addFeedback } from './feedback.service';
import { IBodyPost } from '@/interfaces/';

export const postFeedback = async (req: FastifyRequest<{ Body: IBodyPost }>, res: FastifyReply) => {
  const { name, email, overallSatisfaction, subject, msg } = req.body;
  if (!name || !email || !overallSatisfaction || !subject || !msg) {
    return res.code(404).send({
      status: 'failed',
      message: 'all files are required',
    });
  }
  const feedback = await addFeedback({ name, email, overallSatisfaction, subject, msg });
  res.code(200).send({
    status: 'ok',
    data: feedback,
  });
};

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  reply.code(400).send({
    status: 'Failed',
    message: 'Something went wrong try again',
  });
}
