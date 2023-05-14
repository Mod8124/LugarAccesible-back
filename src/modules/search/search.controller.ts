import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getResults } from "./search.service";

interface MyQuery {
  [key: string]: string;
  lat: string;
  lng: string;
  query: string;
  types: string;
}

export async function getSearch(
  request: FastifyRequest<{ Querystring: MyQuery }>,
  reply: FastifyReply
) {
  const requiredQueries = ["lat", "lng", "query", "types"];
  const missingFields = requiredQueries.filter(
    (field: string) => !request.query[field]
  );

  if (missingFields.length > 0) {
    return reply
      .code(400)
      .send({ status: "failed", error: "Please fill in all the queries", missingFields });
  }

  const { lat, lng, query, types } = request.query;
  const places = await getResults({ lat, lng, query, types });
  reply.code(200).send({
    status: "success",
    data: places,
  });
}

// this handle the global error of the route
export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.code(404).send({
    status: "Failed",
    message: "Something went wrong try again",
  });
}
