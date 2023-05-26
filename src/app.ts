import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { withRefResolver } from 'fastify-zod';
import swaggerUI from '@fastify/swagger-ui';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ConnectMongoDb } from './db/connection/connect';
import { JWT_SECRET } from '../config';

import { UserRoutes } from './modules/users/users.routes';
import PlaceRoutes from './modules/places/places.routes';
import SearchRoutes from './modules/search/search.routes';
import { FeedbackRoutes } from './modules/feedback/feedback.routes';

import { userSchema } from './modules/users/users.schemas';
import { placeSchema } from './modules/places/places.schemas';
import { searchSchema } from './modules/search/search.schema';
import { feedbackSchema } from './modules/feedback/feedback.schema';
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
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
  app.register(cors);

  app.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: {
      expiresIn: '2h', // <== Token expires in 10 minutes
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

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.code(401).send({ staus: 'failed', msg: 'Unauthorized' });
    }
  });

  //::Register Schemas
  for (const schema of [...userSchema, ...placeSchema, ...searchSchema, ...feedbackSchema]) {
    app.addSchema(schema);
  }

  //::Register routes
  const base = '/api/v1/';
  app.register(UserRoutes, { prefix: base + 'user' });
  app.register(PlaceRoutes, { prefix: base + 'place' });
  // app.register(commentRoutes, {prefix: '/comments'})
  app.register(SearchRoutes, { prefix: base + 'search' });
  app.register(FeedbackRoutes, { prefix: base + 'feedback' });

  app.get('/', async function (req, res) {
    res.redirect('/docs');
  });

  return app;
}

export default buildApp;
