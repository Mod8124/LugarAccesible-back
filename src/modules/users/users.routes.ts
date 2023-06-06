import { type FastifyInstance } from 'fastify';
import {
  registerUser,
  loginUser,
  updateUser,
  updatePasswordUser,
  verifyUser,
  logoutUser,
} from './users.controller';
import { $ref } from './users.schemas';

export async function UserRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['User'],
        summary: 'Register  a user in the db(is not active)',
        body: $ref('bodyRegister'),
        response: {
          200: $ref('registerSuccess'),
          400: $ref('registerFailed'),
        },
      },
    },

    registerUser,
  );
  app.post(
    '/login',
    {
      schema: {
        tags: ['User'],
        summary: 'Login the user',
        body: $ref('bodyLogin'),
        response: {
          200: $ref('loginSuccess'),
          400: $ref('registerFailed'),
        },
      },
    },
    loginUser,
  );

  app.post(
    '/update',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        summary: 'update the user',
        body: $ref('bodyUpdate'),
        response: {
          200: $ref('updateSuccess'),
          400: $ref('registerFailed'),
        },
      },
    },
    updateUser,
  );

  app.post(
    '/updatePassword',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        summary: 'update password the user',
        body: $ref('bodyUpdatePassword'),
        response: {
          200: $ref('registerFailed'),
          400: $ref('registerFailed'),
        },
      },
    },
    updatePasswordUser,
  );

  app.get(
    '/validation/:code',
    {
      schema: {
        tags: ['User'],
        summary: 'confirm account user',
        params: $ref('paramsVerify'),
        response: {
          200: $ref('registerFailed'),
          400: $ref('registerFailed'),
        },
      },
    },
    verifyUser,
  );

  app.get(
    '/logout',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        summary: 'logout user session, clear http only cookie',
        response: {
          200: $ref('registerFailed'),
        },
      },
    },
    logoutUser,
  );
}
