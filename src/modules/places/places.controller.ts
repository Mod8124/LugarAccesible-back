import { FastifyReply, FastifyRequest } from 'fastify';
import { getPlaces, getDetails, generate20NearPlaces } from './places.service';
import placesDetailMock from '../../../public/assets/mock/placeDetailMock.json';

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

export async function getPlacesMock(
  req: FastifyRequest<{ Querystring: { lat: number; lng: number } }>,
  res: FastifyReply,
) {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.send({
      message: 'Requires lat and lng as parameters',
    });
  }
  const result = generate20NearPlaces(lat, lng);
  res.code(200).send(result);
}

interface MyQuery {
  place_id: string;
}

export async function getDetailHandler(
  request: FastifyRequest<{ Querystring: MyQuery }>,
  reply: FastifyReply,
) {
  const { place_id } = request.query;
  const { _id } = request.user || {};

  if (!place_id) {
    return reply.code(404).send({ status: 'failed', error: 'place_id is required' });
  }

  if (_id) {
    const result = await getDetails(place_id, _id.toString());
    return reply.code(200).send({
      status: 'success',
      data: [result],
    });
  }

  const result = await getDetails(place_id);
  reply.code(200).send({
    status: 'success',
    data: [result],
  });
}

export async function getDetailMock(
  request: FastifyRequest<{ Querystring: MyQuery }>,
  reply: FastifyReply,
) {
  const { place_id } = request.query;

  if (!place_id) {
    return reply.code(404).send({ status: 'failed', error: 'place_id is required' });
  }

  reply.code(200).send({
    status: 'success',
    data: placesDetailMock,
  });
}
