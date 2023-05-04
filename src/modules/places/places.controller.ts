import type { FastifyReply, FastifyRequest } from "fastify";
import { getPlaces } from "./places.service";

export async function getPlacesHandler(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const places = await getPlaces()
   reply.code(200).send(places)
}

