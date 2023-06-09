import { FastifyReply, FastifyRequest } from 'fastify';
import { IUser, TLoginUser, IUpdate } from './users.service';
import { register, login, update, verify, updatePassword } from './users.service';
import { sendVerificationMail, sendVerificationChangeMail } from '../../helpers/sendEmail';

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

  res
    .setCookie('token', token, {
      path: '/',
      secure: true, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
    })
    .code(200)
    .send({
      status: 'ok',
      msg: 'successful',
      data: {
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

  let message;

  if (!user.isConfirm) {
    await sendVerificationChangeMail({
      email: user.email,
      name: user.name,
      confirmCode: user.confirmCode ? user.confirmCode : '',
    });
    message = 'Perfil Actualizado, Se envió un correo de validación, verifícalo más tarde';
  } else {
    message = 'Usuario Actualizado';
  }

  res.code(200).send({
    status: 'ok',
    msg: message,
    data: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const updatePasswordUser = async (
  req: FastifyRequest<{ Body: { currentPassword: string; newPassword: string } }>,
  res: FastifyReply,
) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword) {
    return res.status(400).send({
      status: 'failed',
      msg: 'La contraseña actual es requerida',
    });
  }
  if (!newPassword) {
    return res.status(400).send({
      status: 'failed',
      msg: 'La contraseña nueva es requerida',
    });
  }
  const { _id } = req.user;
  await updatePassword(_id.toString(), req.body);
  res.code(200).send({
    status: 'ok',
    msg: 'Contraseña Actualizada',
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

export const logoutUser = async (req: FastifyRequest, res: FastifyReply) => {
  res
    .clearCookie('token', {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: true,
    })
    .code(200)
    .send({
      status: 'ok',
      msg: 'Successful delete cookie',
    });
};
