import type { FastifyReply, FastifyRequest } from "fastify";
import { getUsers } from "./users.service";

export async function getUsersHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const users = await getUsers()
   reply.code(200).send(users)
}