import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getComments,
  getRating,
  postComment,
  IPostCommentBody,
  IEdit,
  editComment,
  deleteComment,
} from './comments.service';

export const getCommentByPlaceId = async (
  req: FastifyRequest<{ Querystring: { place_id: string } }>,
  res: FastifyReply,
) => {
  const { place_id } = req.query;

  if (!place_id)
    return res.code(400).send({
      status: 'failed',
      msg: 'place_id is required',
    });

  const { _id } = req.user || {};
  if (!_id) {
    const comments = await getComments(place_id);
    const rating = getRating(comments);
    return res.code(200).send({
      status: 'ok',
      msg: 'get all comments succesful',
      data: {
        rating,
        comments,
      },
    });
  }
  const comments = await getComments(place_id, _id.toString());
  const rating = getRating(comments);
  return res.code(200).send({
    status: 'ok',
    msg: 'get all comments succesful',
    data: {
      rating,
      comments,
    },
  });
};

export const postCommentByPlaceID = async (
  req: FastifyRequest<{ Body: IPostCommentBody }>,
  res: FastifyReply,
) => {
  const requiredFields = ['place_id', 'author', 'rating', 'text'];
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
  const comments = await postComment(req.body, _id.toString());
  const rating = getRating(comments);

  res.code(201).send({
    status: 'ok',
    msg: 'Post comment successful',
    data: {
      rating,
      comments,
    },
  });
};

export const editCommentByPlaceId = async (
  req: FastifyRequest<{ Body: IEdit }>,
  res: FastifyReply,
) => {
  const requiredFields = ['place_id', 'author', 'rating', 'text', 'id'];
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
  const body = req.body;
  const { _id } = req.user;
  const comments = await editComment(body, _id.toString());
  const rating = getRating(comments);
  res.send({
    status: 'ok',
    msg: 'update comment successfull',
    data: {
      rating,
      comments,
    },
  });
};

export const deleteCommentByPlace_id = async (
  req: FastifyRequest<{ Params: { [key: string]: string; place_id: string; id: string } }>,
  res: FastifyReply,
) => {
  const requiredFields = ['place_id', 'id'];
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.params[field]) {
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
  const comments = await deleteComment(req.params, _id.toString());
  const rating = getRating(comments);
  res.code(200).send({
    status: 'ok',
    msg: 'succesful delete',
    data: {
      rating,
      comments,
    },
  });
};
