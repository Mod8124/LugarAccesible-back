import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { withRefResolver } from 'fastify-zod';
import swaggerUI from '@fastify/swagger-ui';
import { authenticate, hasToken } from './middleware/authentication';
import { ConnectMongoDb } from './db/connection/connect';
import { JWT_SECRET } from '../config';
import fastifyMultipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';
import { HOST } from '../config';

import { UserRoutes } from './modules/users/users.routes';
import PlaceRoutes from './modules/places/places.routes';
import SearchRoutes from './modules/search/search.routes';
import { FeedbackRoutes } from './modules/feedback/feedback.routes';
import { CommentRoutes } from './modules/comments/comments.routes';
import { FavoritesRoutes } from './modules/favorites/favorites.routes';

import { userSchema } from './modules/users/users.schemas';
import { placeSchema } from './modules/places/places.schemas';
import { searchSchema } from './modules/search/search.schema';
import { feedbackSchema } from './modules/feedback/feedback.schema';
import { commentSchema } from './modules/comments/comments.schemas';
import { favoriteSchema } from './modules/favorites/favorites.schema';

const path = require('path');

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
    hasToken: any;
  }
}
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      _id: number;
    };
  }
}

export function buildApp() {
  const app = Fastify();

  ConnectMongoDb();
  app.register(cors, {
    origin: HOST, // domain origin of client app
    credentials: true,
  });

  app.register(fastifyMultipart); // to read file, img, etc

  app.register(fastifyCookie); // to set httpOnly Cookie

  app.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false, // the cookie by including an additional signature with the cookie value
    },
    sign: {
      expiresIn: '10h', // <== Token expires in 10 hours
    },
  });

  app.register(
    fastifySwagger,
    withRefResolver({
      openapi: {
        info: {
          title: 'LugarAccesible API',
          description: 'A simple fastify API',
          version: '1.0.0',
        },
        servers: [
          {
            url: 'http://localhost:3000/api/v1/',
            description: 'development server',
          },
        ],
      },
    }),
  );

  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecificationClone: true,
  });

  app.decorate('authenticate', authenticate);
  app.decorate('hasToken', hasToken);

  //::Register Schemas
  for (const schema of [
    ...userSchema,
    ...placeSchema,
    ...searchSchema,
    ...feedbackSchema,
    ...commentSchema,
    ...favoriteSchema,
  ]) {
    app.addSchema(schema);
  }

  //::Register routes
  const base = '/api/v1/';
  app.register(UserRoutes, { prefix: base + 'user' });
  app.register(PlaceRoutes, { prefix: base + 'place' });
  app.register(CommentRoutes, { prefix: base + 'comment' });
  app.register(SearchRoutes, { prefix: base + 'search' });
  app.register(FeedbackRoutes, { prefix: base + 'feedback' });
  app.register(FavoritesRoutes, { prefix: base + 'favorite' });

  app.get('/', async function (req, res) {
    res.redirect('/docs');
  });

  // handle global err
  app.setErrorHandler(function (error, request, reply) {
    if (error) {
      reply.code(400).send({ status: 'failed', msg: error.message });
    }
  });

  app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'front'),
  });

  return app;
}

export default buildApp;
