/* eslint-disable @typescript-eslint/no-var-requires */
import fastifyCookie from '@fastify/cookie'
import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import swaggerUI from "@fastify/swagger-ui"
import type { FastifyRequest, FastifyReply } from 'fastify'

import UserRoutes from './modules/users/users.routes'
import PlaceRoutes from "./modules/places/places.routes"
import commentRoutes from './modules/comments/comments.routes'

import { userSchema } from "./modules/users/users.schemas";
import { placeSchema } from "./modules/places/places.schemas"
import { CommentSchema } from './modules/comments/comments.schemas'

import { JWT_SECRET } from "../config/";
import { placeSchema } from './modules/places/places.schemas'

const path = require('path')


declare module "fastify" {
   export interface FastifyInstance {
      authenticate: any;
   }
}
declare module "@fastify/jwt" {
   interface FastifyJWT {
      user: {
         id: number;
         email: string;
         name: string;
      };
   }
}

export function buildApp(){
   const app = Fastify()
   app.register(cors);

   app.register(fastifyJwt, {
      secret: JWT_SECRET,
      cookie: {
        cookieName: 'refreshToken',
        signed: false, // <== This cookie will not be signed, because we will not read it in the backend
      },
      sign: {
        expiresIn: '2h', // <== Token expires in 10 minutes
      },
   })
   app.register( fastifySwagger, withRefResolver({
      // exposeRoute: true,
      openapi: {
         info: {
            title: 'Devathon ed4 API',
            description: 'http://localhost:4000',
            version: '1.0.0'
         },
      }, 
   }))
   
   app.register(swaggerUI,{
      routePrefix: '/docs',
      uiConfig: {
      docExpansion: 'list',
         deepLinking: false
      },
      staticCSP: true,
      transformStaticCSP: (header: any) => header,
      transformSpecificationClone: true
   })

   app.register(fastifyCookie)
   
   app.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
         try {
            await request.jwtVerify();
         } catch (e) {
            return reply.send(e);
         }
      }
   )

   //::Register Schemas
   for (const schema of [...userSchema, ...placeSchema, ...CommentSchema]) {
      app.addSchema(schema);
   }

   //::Register routes
   app.register(UserRoutes, {prefix: '/users'})
   app.register(PlaceRoutes, {prefix: '/places'})
   app.register(commentRoutes, {prefix: '/comments'})

   app.register(require('@fastify/static'), {
      root: path.join(__dirname, 'front')
   })

   return app
}

export default buildApp;
