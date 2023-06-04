import { FastifyRequest, FastifyReply } from 'fastify';
import { getFavorites, postFavorite, IBodyPostComment, deleteFavorite } from './favorites.service';

export const getFavoritesByUserId = async (req: FastifyRequest, res: FastifyReply) => {
  const { _id } = req.user;
  const favorites = await getFavorites(_id.toString());
  res.code(200).send({
    status: 'ok',
    msg: 'successful on get favorites',
    data: favorites,
  });
};

export const postFavoriteByPlaceId = async (
  req: FastifyRequest<{
    Body: IBodyPostComment;
  }>,
  res: FastifyReply,
) => {
  const requiredFields = ['place_id', 'name', 'location'];
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const missingFieldsMsg = missingFields.join(', ');
    res.status(400).send({
      status: 'failed',
      msg: `${missingFieldsMsg} ${missingFields.length > 1 ? 'son' : 'es'} requerido`,
    });
    return;
  }
  const { _id } = req.user;
  const favorite = await postFavorite(_id.toString(), req.body);
  res.code(200).send({
    status: 'ok',
    msg: 'successful on get favorites',
    data: favorite,
  });
};

export const deleteFavoriteByPlaceId = async (
  req: FastifyRequest<{
    Params: { place_id: string };
  }>,
  res: FastifyReply,
) => {
  const { place_id } = req.params;
  if (!place_id) {
    res.status(400).send({
      status: 'failed',
      msg: 'place_id es requerido',
    });
    return;
  }
  const { _id } = req.user;
  const favorite = await deleteFavorite(_id.toString(), req.params);
  res.code(200).send({
    status: 'ok',
    msg: 'successful on get favorites',
    data: favorite,
  });
};
