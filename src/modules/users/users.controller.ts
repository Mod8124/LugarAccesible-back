import { FastifyReply, FastifyRequest } from 'fastify';
import { IUser, TLoginUser, IUpdate } from './users.service';
import { register, login, update, verify } from './users.service';
import { sendVerificationMail } from '../../helpers/sendEmail';

interface IRegisterBody extends IUser {
  [key: string]: string;
}

interface ILoginBody extends TLoginUser {
  [key: string]: string;
}

export const registerUser = async (
  req: FastifyRequest<{ Body: IRegisterBody }>,
  res: FastifyReply,
) => {
  const requiredFields = ['name', 'password', 'email'];
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
      msg: `${
        missingFieldsMsg === 'name'
          ? 'Nombre'
          : missingFieldsMsg === 'password'
          ? 'Contraseña'
          : 'Email'
      } ${missingFields.length > 1 ? 'son' : 'es'} requerido`,
    });
    return;
  }

  const user = await register(req.body);

  await sendVerificationMail({
    email: user.email,
    name: user.name,
    confirmCode: user.confirmCode ? user.confirmCode : '',
  });

  res
    .code(201)
    .send({ status: 'ok', msg: 'Usuario registrado, Se envió  un correo de validación' });
};

export const loginUser = async (req: FastifyRequest<{ Body: ILoginBody }>, res: FastifyReply) => {
  const requiredFields = ['password', 'email'];
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
      msg: `${missingFieldsMsg === 'password' ? 'Contraseña' : 'Email'} ${
        missingFields.length > 1 ? 'son' : 'es'
      } requerido`,
    });
    return;
  }
  const user = await login(req.body);
  if (!user.isConfirm) {
    await sendVerificationMail({
      email: user.email,
      name: user.name,
      confirmCode: user.confirmCode ? user.confirmCode : '',
    });
    return res.code(400).send({
      status: 'ok',
      msg: 'Por favor verifique su cuenta, Se envió un correo de validación',
    });
  }
  const token = await res.jwtSign({ _id: user._id });
  res.code(200).send({
    status: 'ok',
    msg: 'sucessful',
    data: {
      accesstoken: token,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const updateUser = async (req: FastifyRequest<{ Body: IUpdate }>, res: FastifyReply) => {
  const requiredFields = ['email', 'name', 'avatar'];
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
  const user = await update(_id.toString(), req.body);
  if (!user)
    return res.code(400).send({
      status: 'error',
      msg: 'User not found in request',
    });
  res.code(200).send({
    status: 'ok',
    msg: 'Usuario Actualizado',
    data: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const verifyUser = async (
  req: FastifyRequest<{ Params: { code: string } }>,
  res: FastifyReply,
) => {
  const code = req.params.code;

  if (!code) {
    return res.code(400).send({
      status: 'failed',
      msg: 'Code validation is required',
    });
  }

  const user = await verify(code);
  if (user) {
    res.code(200).send({
      status: 'ok',
      msg: 'Usuario Confimado',
    });
  }
};
