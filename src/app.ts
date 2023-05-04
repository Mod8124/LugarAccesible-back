/* eslint-disable @typescript-eslint/no-var-requires */

import fastifyCookie from '@fastify/cookie'
const Fastify = require('fastify')
import fastifyJwt from '@fastify/jwt'

import UserRoutes from './modules/users/users.routes'
import fastifySwagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import swaggerUI from "@fastify/swagger-ui"
import { userSchema } from "./modules/users/users.schemas";
import { JWT_SECRET } from "../config/";
import { FastifyRequest, FastifyReply } from 'fastify'

export const app = Fastify()

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

/**https://github.com/nearform/fastify-auth0-verify/blob/master/examples/index.js */
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
//↓ Register routes
app.get("/", () => ({message: 'Welcome to our api'}))
app.register(UserRoutes, {prefix: '/users'})

for (const schema of [...userSchema]) {
   app.addSchema(schema);
}

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

