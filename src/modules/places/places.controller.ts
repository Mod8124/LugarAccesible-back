import { FastifyReply, FastifyRequest } from 'fastify';
import { getPlaces, getDetails } from './places.service';

export async function getPlacesHandler(
  request: FastifyRequest<{ Querystring: { lat: string; lng: string } }>,
  reply: FastifyReply,
) {
  const { lat, lng } = request.query;
  if (!lat || !lng) {
    return reply.send({
      message: 'Requires lat and lng as parameters',
    });
  }
  const places = await getPlaces({ lat, lng });
  reply.code(200).send(places);
}

interface MyQuery {
  place_id: string;
}

export async function getDetailHandler(
  request: FastifyRequest<{ Querystring: MyQuery }>,
  reply: FastifyReply,
) {
  const { place_id } = request.query;
  if (!place_id) {
    return reply.code(404).send({ status: 'failed', error: 'place_id is required' });
  }
  const result = await getDetails(place_id);
  reply.code(200).send({
    status: 'success',
    data: [result],
  });
}
