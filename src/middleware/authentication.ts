import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ status: 'failed', message: 'Unauthorized' });
  }
}

export async function hasToken(request: FastifyRequest, reply: FastifyReply, done: any) {
  try {
    await request.jwtVerify();
  } catch (e) {
    if (e) done();
  }
}
