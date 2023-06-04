import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ status: 'failed', message: 'Unauthorized' });
  }
}

export async function hasToken(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  try {
    await request.jwtVerify();
  } catch (error) {
    // If the token verification fails, you can perform additional actions here
    // For example, you can log the error or perform some cleanup
  }

  done();
}
